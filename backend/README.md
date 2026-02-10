# ADHD Support Chatbot

A hybrid AI chatbot for ADHD support, combining a rule-based engine with Ollama (local LLM) for intelligent, empathetic assistance.

## Features

- 🧠 **80 ADHD-Specific Rules**: Organized into calming, task parsing, education, and coping strategies
- 🤖 **Ollama Integration**: Local LLM (Llama3/Mistral) for natural language generation
- 📋 **Smart Task Management**: Automatic task extraction and priority-based categorization
- 🚨 **Safety Net**: Crisis detection with professional resource redirection
- 💾 **Persistent Chat**: LocalStorage-based chat history and task persistence
- 🎨 **Beautiful UI**: Glassmorphic design with priority-based color coding

## Architecture

```
┌─────────────────────────────────────────┐
│          Frontend (React)               │
│  - ChatbotPage                          │
│  - ChatMessage, TaskSidebar, ChatInput  │
└──────────────┬──────────────────────────┘
               │ HTTP (axios)
┌──────────────▼──────────────────────────┐
│       Backend (Express Server)          │
│  ┌────────────────────────────────────┐ │
│  │  1. Safety Net Check (Crisis)      │ │
│  │  2. Rules Engine (80 rules)        │ │
│  │  3. Task Parser (if needed)        │ │
│  │  4. Ollama Service (refinement)    │ │
│  └────────────────────────────────────┘ │
└──────────────┬──────────────────────────┘
               │ HTTP
┌──────────────▼──────────────────────────┐
│         Ollama (Local LLM)              │
│  - Llama3 / Mistral                     │
│  - Temperature: 0.7, Top-P: 0.9         │
└─────────────────────────────────────────┘
```

## Setup Instructions

### 1. Install Ollama

Download and install Ollama from [https://ollama.ai](https://ollama.ai)

**Pull a model:**
```bash
# Recommended: Llama3 (4.7GB)
ollama pull llama3

# Alternative: Mistral (4.1GB)
ollama pull mistral
```

**Verify Ollama is running:**
```bash
curl http://localhost:11434/api/tags
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
# From project root
npm install
```

### 4. Configure Environment (Optional)

Edit `backend/.env` to customize:
```env
OLLAMA_BASE_URL=http://localhost:11434
PORT=3001
OLLAMA_MODEL=llama3
NODE_ENV=development
```

## Running the Application

### Option 1: Run Everything Together (Recommended)

```bash
# From project root
npm run dev:full
```

This starts both the frontend (Vite) and backend (Express) concurrently.

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
npm run server
# or
cd backend && npm start
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## Accessing the Chatbot

1. Navigate to `http://localhost:5173`
2. Go to **ADHD Dashboard** (`/adhd-dashboard`)
3. Click on **ADHD Support Chat** module
4. Start chatting! 💬

## Usage Examples

### Panic/Anxiety Support
```
User: "I'm panicking about my exam tomorrow"
Bot: "Take a deep breath with me 😌. You're not alone – let's break this down..."
```

### Task Management
```
User: "I need to study, take meds, do laundry, and email professor"
Bot: [Extracts and categorizes tasks]
- 🚨 URGENT: Take meds
- 🔴 HIGH: Email professor, Study
- 🟢 LOW: Do laundry
```

### Educational Explanations
```
User: "Explain neural networks like a childlike story"
Bot: "Once upon a time, in a magical brain village..."
```

### Coping Strategies
```
User: "I'm hyperfocusing on the wrong thing"
Bot: "That's your superpower in disguise! Set a timer to switch – try 25 min work + 5 min break..."
```

## API Endpoints

### `POST /api/chat`
Send a message to the chatbot.

**Request:**
```json
{
  "message": "I'm feeling overwhelmed",
  "sessionId": "session_123",
  "conversationHistory": []
}
```

**Response:**
```json
{
  "response": "I hear you – that's a lot...",
  "action": "parse_tasks_urgent",
  "tasks": [...],
  "ruleTriggered": true,
  "rulePriority": 10,
  "timestamp": "2026-02-10T20:00:00.000Z"
}
```

### `GET /api/health`
Check backend and Ollama connection status.

### `GET /api/rules`
View rule statistics (for debugging).

### `POST /api/test/parse-tasks`
Test task parsing (for debugging).

## Rule Categories

1. **Calming & Emotional Support (Rules 1-20)**
   - Panic, anxiety, rejection, exhaustion, anger, etc.

2. **Task Parsing & Prioritization (Rules 21-40)**
   - Exams, meds, deadlines, appointments, work, etc.

3. **Educational & Concept Explanation (Rules 41-60)**
   - ADHD education, neuroplasticity, dopamine, etc.

4. **General ADHD Coping (Rules 61-80)**
   - Hyperfocus, procrastination, time management, etc.

## Troubleshooting

### Backend won't start
- Ensure port 3001 is available
- Check `backend/package.json` exists
- Run `cd backend && npm install`

### Ollama not connecting
- Verify Ollama is running: `ollama list`
- Check Ollama URL in `backend/.env`
- Pull a model: `ollama pull llama3`

### Frontend errors
- Clear browser cache and localStorage
- Check browser console for errors
- Ensure backend is running on port 3001

### Tasks not appearing
- Check browser console for API errors
- Verify backend is processing tasks correctly
- Test with: `curl -X POST http://localhost:3001/api/test/parse-tasks -H "Content-Type: application/json" -d '{"message":"I need to study and take meds"}'`

## File Structure

```
lock-focus/
├── backend/
│   ├── server.js              # Express server
│   ├── rules-engine.js        # Rule-based engine
│   ├── ollama-service.js      # Ollama integration
│   ├── task-parser.js         # Task extraction
│   ├── rule-definitions.json  # 80 rules
│   ├── package.json
│   └── .env
├── src/
│   ├── pages/
│   │   └── ChatbotPage.jsx    # Main chatbot page
│   ├── components/
│   │   ├── ChatMessage.jsx    # Message component
│   │   ├── TaskSidebar.jsx    # Task list sidebar
│   │   └── ChatInput.jsx      # Input component
│   └── utils/
│       └── chatbot-api.js     # API client
└── package.json
```

## System Requirements

- **RAM**: 8GB minimum (16GB recommended for Ollama)
- **Disk**: ~5-7GB for Ollama model
- **Node.js**: v18 or higher
- **OS**: Windows, macOS, or Linux

## Technologies Used

- **Frontend**: React, Vite, Framer Motion, Lucide Icons, Tailwind CSS
- **Backend**: Node.js, Express, Axios
- **AI**: Ollama (Llama3/Mistral)
- **Storage**: LocalStorage (frontend), In-memory (backend)

## Future Enhancements

- [ ] Database integration for persistent storage
- [ ] User authentication and profiles
- [ ] Voice input/output
- [ ] Mobile app version
- [ ] Multi-language support
- [ ] Integration with calendar apps
- [ ] Gamification and rewards system

## License

MIT

## Support

For issues or questions, please open an issue on GitHub or contact the development team.
