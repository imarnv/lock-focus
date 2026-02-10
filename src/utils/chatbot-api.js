import axios from 'axios';

const API_BASE_URL = ''; // Use relative path with Vite proxy

/**
 * API client for ADHD Chatbot backend
 */
class ChatbotAPI {
    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    /**
     * Send a message to the chatbot
     * @param {string} message - User's message
     * @param {string} sessionId - Session identifier
     * @param {Array} conversationHistory - Previous messages
     * @returns {Promise<Object>} - Chatbot response
     */
    async sendMessage(message, sessionId = 'default', conversationHistory = []) {
        try {
            const response = await this.client.post('/api/chat', {
                message,
                sessionId,
                conversationHistory
            });

            return response.data;
        } catch (error) {
            console.error('Chatbot API error:', error);

            // Return fallback response
            return {
                response: "I'm having trouble connecting right now. Please make sure the backend server is running. 💙",
                action: 'error',
                tasks: [],
                ruleTriggered: false,
                error: true
            };
        }
    }

    /**
     * Check backend health
     * @returns {Promise<Object>} - Health status
     */
    async checkHealth() {
        try {
            const response = await this.client.get('/api/health');
            return response.data;
        } catch (error) {
            return {
                status: 'error',
                ollama: 'disconnected',
                error: error.message
            };
        }
    }

    /**
     * Test task parsing (for debugging)
     * @param {string} message - Message to parse
     * @returns {Promise<Object>} - Parsed tasks
     */
    async testTaskParsing(message) {
        try {
            const response = await this.client.post('/api/test/parse-tasks', { message });
            return response.data;
        } catch (error) {
            console.error('Task parsing test error:', error);
            return { error: error.message };
        }
    }
}

export default new ChatbotAPI();
