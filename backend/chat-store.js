import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'chat_history.json');

// Ensure encrytion key is available
let ENCRYPTION_KEY;
if (process.env.ENCRYPTION_KEY) {
    ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
} else {
    // Fallback for development if not set (though it should be)
    console.warn("⚠️  WARNING: No ENCRYPTION_KEY found in .env. Using ephemeral key.");
    ENCRYPTION_KEY = crypto.randomBytes(32);
}

const ALGORITHM = 'aes-256-cbc';

class ChatStore {
    constructor() {
        this.init();
    }

    async init() {
        try {
            await fs.access(DB_PATH);
        } catch (error) {
            // File doesn't exist, create it with empty object
            if (error.code === 'ENOENT') {
                await fs.writeFile(DB_PATH, JSON.stringify({}, null, 2));
                console.log('📄 Created new chat_history.json');
            }
        }
    }

    // Encrypt individual message content
    encrypt(text) {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return {
            iv: iv.toString('hex'),
            content: encrypted
        };
    }

    // Decrypt individual message content
    decrypt(encryptedData, ivHex) {
        const iv = Buffer.from(ivHex, 'hex');
        const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }

    async saveChat(sessionId, messages) {
        try {
            await this.init(); // Ensure file exists

            // Read current file
            const data = await fs.readFile(DB_PATH, 'utf8');
            let history = {};
            try {
                history = JSON.parse(data);
            } catch (e) {
                console.error("Error parsing chat history JSON:", e);
                history = {};
            }

            // Encrypt content of each message
            const encryptedMessages = messages.map(msg => {
                const encrypted = this.encrypt(msg.content);
                return {
                    role: msg.role,
                    timestamp: new Date().toISOString(),
                    encrypted_content: encrypted.content,
                    iv: encrypted.iv
                };
            });

            history[sessionId] = {
                last_updated: new Date().toISOString(),
                messages: encryptedMessages
            };

            // Write back to file
            await fs.writeFile(DB_PATH, JSON.stringify(history, null, 2));
            console.log(`💾 Saved session ${sessionId} to JSON`);

        } catch (error) {
            console.error('❌ Failed to save chat:', error);
            throw error;
        }
    }

    async getChat(sessionId) {
        try {
            const data = await fs.readFile(DB_PATH, 'utf8');
            const history = JSON.parse(data);
            const sessionData = history[sessionId];

            if (!sessionData || !sessionData.messages) return [];

            // Decrypt messages
            return sessionData.messages.map(msg => ({
                role: msg.role,
                content: this.decrypt(msg.encrypted_content, msg.iv)
            }));

        } catch (error) {
            console.error('❌ Failed to retrieve chat:', error);
            return [];
        }
    }

    // Helper to get raw DB for debugging (returns the full JSON object)
    async getDb() {
        try {
            const data = await fs.readFile(DB_PATH, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return {};
        }
    }
}

export default new ChatStore();
