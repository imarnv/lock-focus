import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

async function testRaw() {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    console.log('--- Raw API Test ---');
    console.log('Target URL:', `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=REDACTED`);

    try {
        const response = await axios.post(url, {
            contents: [{
                parts: [{ text: "Hello" }]
            }]
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });

        console.log('Response status:', response.status);
        console.log('Response data:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Raw API Error:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

testRaw();
