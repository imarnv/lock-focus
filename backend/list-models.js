import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        console.log('Listing available models...');
        // The listModels method might not exist in all versions of the SDK, 
        // but we can try to fetch a known model metadata.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log('Model object created. Testing access...');

        const result = await model.generateContent("test");
        console.log('Success! gemini-1.5-flash is available.');
    } catch (error) {
        console.error('Error identifying model:');
        console.error(error.message);
        if (error.response) console.error(error.response.data);
    }
}

listModels();
