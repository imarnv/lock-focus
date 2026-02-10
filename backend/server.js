import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import RulesEngine from './rules-engine.js';
import GeminiService from './gemini-service.js';
import TaskParser from './task-parser.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize services
const rulesEngine = new RulesEngine();
const ollamaService = new GeminiService(); // Renaming variable to keep existing logic working with minimal changes
const taskParser = new TaskParser();

// Store conversation histories (in-memory for now)
const conversationHistories = new Map();

/**
 * Health check endpoint
 */
app.get('/api/health', async (req, res) => {
    const ollamaAvailable = await ollamaService.isAvailable();

    res.json({
        status: 'ok',
        ollama: ollamaAvailable ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

/**
 * Main chat endpoint
 * Handles hybrid rule-based + Ollama processing
 */
app.post('/api/chat', async (req, res) => {
    try {
        const { message, sessionId = 'default', conversationHistory = [] } = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: 'Message is required' });
        }

        console.log(`[${sessionId}] User: ${message}`);

        // Step 1: Check safety net first (highest priority)
        if (rulesEngine.isSafetyNetTriggered(message)) {
            const safetyResponse = rulesEngine.getSafetyNetResponse();
            console.log(`[${sessionId}] Safety net triggered`);

            return res.json({
                response: safetyResponse.response,
                action: safetyResponse.action,
                tasks: [],
                ruleTriggered: true,
                rulePriority: safetyResponse.priority
            });
        }

        // Step 2: Analyze with rules engine
        const matchedRules = rulesEngine.analyzeInput(message);
        const topRule = rulesEngine.getTopRule(matchedRules);

        // Step 3: Check for multiple tasks
        const hasMultipleTasks = rulesEngine.hasMultipleTasks(message);
        let extractedTasks = [];

        if (hasMultipleTasks || (topRule && topRule.action.includes('parse_tasks'))) {
            extractedTasks = taskParser.extractTasks(message);
            console.log(`[${sessionId}] Extracted ${extractedTasks.length} tasks`);
        }

        // Step 4: Build response
        let finalResponse = '';
        let action = 'general_support';
        let ruleTriggered = false;

        if (topRule) {
            ruleTriggered = true;
            action = topRule.action;

            console.log(`[${sessionId}] Rule triggered: ${topRule.id} (${topRule.category})`);

            // If tasks were extracted, format them
            if (extractedTasks.length > 0) {
                const taskDisplay = taskParser.formatTasksForDisplay(extractedTasks);

                // Combine rule response with task display
                const ollamaAvailable = await ollamaService.isAvailable();

                if (ollamaAvailable) {
                    // Use Ollama to create a natural response combining both
                    const combinedPrompt = `${topRule.response}\n\n${taskDisplay}`;
                    finalResponse = await ollamaService.refineResponse(combinedPrompt, message);
                } else {
                    finalResponse = `${topRule.response}\n\n${taskDisplay}`;
                }
            } else {
                // No tasks, just refine the rule response with Ollama
                const ollamaAvailable = await ollamaService.isAvailable();

                if (ollamaAvailable) {
                    // Always use generateResponse for educational/support topics to get Gemini's natural voice
                    // We pass the rule context so it knows WHAT to talk about, but let it choose HOW to say it.
                    finalResponse = await ollamaService.generateResponse(message, conversationHistories.get(sessionId) || [], topRule);
                } else {
                    finalResponse = topRule.response;
                }
            }
        } else {
            // No rule matched, use Ollama for general response
            console.log(`[${sessionId}] No rule matched, using Ollama`);

            const ollamaAvailable = await ollamaService.isAvailable();

            if (ollamaAvailable) {
                // Get conversation history for this session
                const history = conversationHistories.get(sessionId) || [];
                finalResponse = await ollamaService.generateResponse(message, history);

                // Update conversation history
                history.push({ role: 'user', content: message });
                history.push({ role: 'assistant', content: finalResponse });

                // Keep only last 10 messages to avoid context overflow
                if (history.length > 20) {
                    history.splice(0, history.length - 20);
                }

                conversationHistories.set(sessionId, history);
            } else {
                finalResponse = "I'm here to help with ADHD strategies and Lock Focus tips! Tell me what's on your mind. 💙\n\nNote: The AI service is currently unavailable, but I can still help with basic support.";
            }
        }

        // Step 5: Send response
        res.json({
            response: finalResponse,
            action: action,
            tasks: extractedTasks,
            ruleTriggered: ruleTriggered,
            rulePriority: topRule ? topRule.priority : 0,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Chat endpoint error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

/**
 * Get all rules (for debugging)
 */
app.get('/api/rules', (req, res) => {
    res.json({
        totalRules: rulesEngine.rules.length,
        categories: {
            calming: rulesEngine.rules.filter(r => r.category === 'calming').length,
            task_parsing: rulesEngine.rules.filter(r => r.category === 'task_parsing').length,
            education: rulesEngine.rules.filter(r => r.category === 'education').length,
            coping: rulesEngine.rules.filter(r => r.category === 'coping').length
        }
    });
});

/**
 * Test task parsing (for debugging)
 */
app.post('/api/test/parse-tasks', (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    const tasks = taskParser.extractTasks(message);
    const categorized = taskParser.categorizeTasks(tasks);

    res.json({
        input: message,
        tasksFound: tasks.length,
        tasks: tasks,
        categorized: categorized
    });
});

// Start server
app.listen(PORT, async () => {
    console.log(`🤖 ADHD Chatbot Backend running on port ${PORT}`);
    console.log(`📍 API endpoint: http://localhost:${PORT}/api/chat`);

    // Check Gemini connection
    const geminiAvailable = await ollamaService.isAvailable();
    if (geminiAvailable) {
        console.log(`✅ Gemini API connected`);
    } else {
        console.log(`⚠️  Gemini API Key missing - running in fallback mode`);
        console.log(`   To enable Gemini:`);
        console.log(`   1. Get key from https://aistudio.google.com/app/apikey`);
        console.log(`   2. Add GEMINI_API_KEY to backend/.env`);
    }

    console.log(`\n📊 Rules Engine loaded with ${rulesEngine.rules.length} rules`);
    console.log(`🎯 Ready to support ADHD users!\n`);
});

export default app;
