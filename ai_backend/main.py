from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from memory_manager import MemoryManager
from llm_client import LLMClient
from executive_engine import ExecutiveEngine
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Lock Focus AI Backend")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    print("Checking Ollama connection...")
    try:
        status = llm.check_connection()
        if status:
            print(f"✅ Connected to Ollama. Model: {llm.model}")
        else:
            print("❌ Could not connect to Ollama. Ensure 'ollama serve' is running.")
    except Exception as e:
        print(f"❌ Error connecting to Ollama: {e}")

memory = MemoryManager()
llm = LLMClient()
executive = ExecutiveEngine()

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    mental_state: str
    tasks: Optional[List[dict]] = None
    next_step: Optional[str] = None

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    # 1. Get context
    profile = memory.get_profile()
    history = memory.get_recent_history()
    
    # 2. EXECUTIVE OVERRIDE: Analyze input and decide strategy
    mental_state, system_instruction, direct_response = executive.analyze_input(request.message, history)
    
    # If the Executive Engine decides to handle it directly (e.g. for extreme loops), return immediately
    if direct_response:
        return ChatResponse(
            response=direct_response,
            mental_state=mental_state
        )

    # 3. Get AI response using the STRATEGY from the Executive Engine
    print(f"🧠 Executive State: {mental_state}")
    result = llm.chat(request.message, history, profile, system_instruction=system_instruction)
    
    if "error" in result:
        return ChatResponse(
            response=result["response"],
            mental_state="error"
        )

    # 3. Handle structure (if LLM returned tasks)
    tasks = result.get("tasks", [])
    if tasks:
        memory.sync_tasks(tasks)
        
    # 4. Save to history (STRIPPING emotions internally in MemoryManager)
    memory.add_history("user", request.message)
    memory.add_history("assistant", result["response"])
    
    # 5. Track stable patterns (e.g. state triggers)
    if mental_state != "neutral":
        memory.update_pattern(f"trigger_{mental_state}", request.message, confidence=0.7)
    
    # 6. Extract additional data
    return ChatResponse(
        response=result["response"],
        mental_state=result.get("mental_state", mental_state),
        tasks=tasks,
        next_step=result.get("next_step")
    )

@app.delete("/history")
async def clear_history():
    memory.clear_history()
    return {"status": "cleared", "message": "Memory wiped."}

@app.get("/status")
async def status():
    return {"status": "online", "model": llm.model}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
