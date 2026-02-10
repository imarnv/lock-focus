import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Gemini Service for LLM Integration
 * Communicates with Google's Gemini API for natural language generation
 */
class GeminiService {
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error('❌ GEMINI_API_KEY is missing in .env file');
        }

        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        this.systemPrompt = this.buildSystemPrompt();
    }

    /**
     * Build the system prompt
     * @returns {string} - System prompt
     */
    buildSystemPrompt() {
        return `You are Gemini, a highly advanced AI ADHD support companion.
You are the direct interface for the Lock Focus app's executive function support.
Speak naturally, warmly, and as yourself (Gemini). No scripts, no robotic prefixes.

Your Goal:
Help ADHD users navigate their day with empathy and clarity.
If they share a list, help them prioritize (High/Medium/Low).
If they are overwhelmed, guide them through one small step.

Lock Focus context:
Focus Flow (Attention), PeriQuest (Peripheral vision), Syllable Slasher (Inhibition), 
Color Match (Memory), Time Blindness (Time perception).

Always end with a gentle, encouraging question.`;
    }

    /**
     * Check if the API key is configured
     * @returns {Promise<boolean>}
     */
    async isAvailable() {
        return !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE';
    }

    /**
     * Generate a response using Gemini
     * @param {string} userMessage - The user's message
     * @param {Array} conversationHistory - Previous messages for context
     * @param {Object} ruleContext - Context from matched rule (optional)
     * @returns {Promise<string>} - Generated response
     */
    async generateResponse(userMessage, conversationHistory = [], ruleContext = null) {
        try {
            console.log(`🧠 Gemini: Processing request...`);

            let prompt = "";
            if (ruleContext) {
                // Pass the context but tell Gemini to incorporate it naturally
                prompt = `Context/Goal: ${ruleContext.response}\n\n`;
            }
            prompt += `User: ${userMessage}\n\nRespond as Gemini. Be natural, direct, and empathetic.`;

            const chat = this.model.startChat({
                history: [
                    { role: "user", parts: [{ text: this.systemPrompt }] },
                    { role: "model", parts: [{ text: "Hello! I am Gemini, your ADHD support partner. I'm here to help you focus and navigate whatever is on your mind. How can I assist you today?" }] },
                    ...conversationHistory.map(msg => ({
                        role: msg.role === 'user' ? 'user' : 'model',
                        parts: [{ text: msg.content }]
                    }))
                ],
            });

            const result = await chat.sendMessage(prompt);
            const response = await result.response;
            console.log(`✅ Gemini: Response generated`);
            return response.text();

        } catch (error) {
            console.error('❌ Gemini Error:', error);
            return "I'm having a little trouble connecting to my brain, but I'm still here! Let's take a breath together. What's one small thing we can focus on right now?";
        }
    }

    /**
     * Refine a response (legacy support)
     */
    async refineResponse(ruleResponse, userMessage) {
        return this.generateResponse(userMessage, [], { response: ruleResponse });
    }
}

export default GeminiService;
