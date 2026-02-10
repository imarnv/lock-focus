import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

async function test() {
    console.log('--- Gemini Connection Test ---');
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('API Key present:', !!apiKey);

    if (!apiKey) {
        console.error('ERROR: GEMINI_API_KEY not found in .env');
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        console.log('Sending test message...');
        const result = await model.generateContent("Hello, are you there?");
        const response = await result.response;
        console.log('Response received:');
        console.log(response.text());
        console.log('---------------------------');
        console.log('SUCCESS: Connection verified.');
    } catch (error) {
        console.error('---------------------------');
        console.error('FAILURE: Gemini API Error');
        console.error(error);
        if (error.stack) console.error(error.stack);
    }
}

test();
