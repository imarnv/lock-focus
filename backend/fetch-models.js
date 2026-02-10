import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

async function fetchAuthorizedModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    console.log('--- Fetching Authorized Models ---');

    try {
        const response = await axios.get(url);
        console.log('Status:', response.status);
        console.log('Models found:', response.data.models.length);
        console.log('First 5 models:');
        response.data.models.slice(0, 5).forEach(m => console.log(` - ${m.name}`));

        // Check if gemini-1.5-flash is in there
        const names = response.data.models.map(m => m.name);
        console.log('gemini-1.5-flash present:', names.includes('models/gemini-1.5-flash'));
        console.log('gemini-2.0-flash-exp present:', names.includes('models/gemini-2.0-flash-exp'));

    } catch (error) {
        console.error('Fetch Models Error:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

fetchAuthorizedModels();
