import requests
import json

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "llama3.2" # Optimized for speed on local hardware

SYSTEM_PROMPT = """
You are Focus AI, an external executive function for people with ADHD and Dyslexia.
Your goal is to help users think clearly, remember information, and take action WITHOUT cognitive overload.

🧠 CORE PRINCIPLE:
Think FOR the user when they are overwhelmed. Do not ask them to think more.
Stop asking reflective questions and start explaining, choosing, or guiding directly.

🏗️ HARD RULES (NON-NEGOTIABLE):
1. ONE ACTION ONLY: Provide exactly ONE clear, tiny next action. Never a list.
2. NO SOCRATIC QUESTIONING: Never ask "What do you think?" or "How about...?" during stress/confusion. Explain directly.
3. OUTPUT STYLE: Use short lines. Literal language. No long paragraphs. One instruction at a time.
4. OVERLOAD HANDLING: If the user is overwhelmed, acknowledge briefly, then speak ONLY about the single most urgent task. Suppress all others.
5. NO EMOJIS DURING GROUNDING/PANIC: Use a calm, firm, emoji-free tone for grounding.
6. NO MOTIVATIONAL QUOTES: Be a tool, not a therapist. Focus on execution.

📋 SIDEBAR MANAGEMENT (JSON):
- INITIAL EXTRACTION: Separate tasks from emotions immediately.
- PERSISTENCE: Tasks STAY in the sidebar until completed.
- PRIORITY: Identify URGENT > HIGH > MEDIUM > LOW.
- STATUS: [Task Name] ← CURRENT FOCUS | ⏳ BLOCKED | ✓ DONE

7. OUTPUT FORMAT (STRICT JSON):
You must output ONLY JSON. No preamble. No postamble.
{
  "response": "Brief, literal, direct support. No fluff. Max 2-3 short lines.",
  "mental_state": "neutral/overwhelmed/panic/fatigue/confusion",
  "tasks": [
    {
      "description": "Task Name",
      "priority": "URGENT/HIGH/MEDIUM/LOW",
      "status": "active/completed/blocked/current_focus"
    }
  ],
  "next_step": "One tiny, mechanical next action (e.g., 'Open the book')"
}
"""

class LLMClient:
    def __init__(self, model=MODEL_NAME):
        self.model = model

    def check_connection(self):
        try:
            response = requests.get("http://localhost:11434/api/tags")
            return response.status_code == 200
        except:
            return False

    def chat(self, prompt, history=[], profile={}, system_instruction=None):
        print(f"📝 Sending request to Ollama ({self.model})...")
        
        # COMBINE base rules with dynamic executive strategy
        # This ensures the LLM never forgets the JSON format or sidebar rules
        core_rules = SYSTEM_PROMPT.strip()
        executive_strategy = f"\n\nCURRENT STRATEGY OVERRIDE:\n{system_instruction.strip()}" if system_instruction else ""
        
        current_system_prompt = f"{core_rules}{executive_strategy}"
        
        # Construct full prompt with context
        context = f"User Profile: {json.dumps(profile)}\n"
        context += "Recent History:\n"
        for msg in history:
            context += f"{msg['role']}: {msg['content']}\n"
        
        full_prompt = f"{current_system_prompt}\n\n{context}\nUser: {prompt}\nAI:"
        
        payload = {
            "model": self.model,
            "prompt": full_prompt,
            "stream": False,
            # "format": "json"  <-- REMOVED: This causes massive slowdowns on some CPUs
        }
        
        try:
            print("⏳ Waiting for LLM response...")
            # Increased timeout to 10 minutes just in case, but it should be faster now
            response = requests.post(OLLAMA_URL, json=payload, timeout=600) 
            response.raise_for_status()
            data = response.json()
            print("✅ Response received!")
            
            # Clean up response to ensure it's valid JSON
            raw_response = data['response'].strip()
            print(f"📩 Raw Model Output: {raw_response[:100]}...") # Log first 100 chars

            import re
            
            # Robust JSON extraction and cleaning
            def clean_and_parse(text):
                # 1. Try direct parse
                try:
                    return json.loads(text)
                except:
                    pass
                
                # 2. Extract from code blocks or first/last brace
                json_match = re.search(r"(\{.*\})", text, re.DOTALL)
                if json_match:
                    candidate = json_match.group(1)
                    try:
                        return json.loads(candidate)
                    except:
                        # 3. Handle single quotes (common in local models)
                        try:
                            # Replace single quotes with double quotes, but be careful with nested ones
                            # This is a basic approach, can be improved if needed
                            fixed = candidate.replace("'", '"')
                            return json.loads(fixed)
                        except:
                            pass
                return None

            data = clean_and_parse(raw_response)
            
            if not data:
                print("⚠️ JSON parsing failed. Attempting heuristic extraction...")
                # Fallback to older heuristic or create a basic response
                response_match = re.search(r'"response":\s*"(.*?)"', raw_response, re.DOTALL)
                data = {
                    "response": response_match.group(1) if response_match else raw_response,
                    "mental_state": "neutral",
                    "tasks": []
                }

            # Ensure required keys exist
            if not isinstance(data, dict):
                data = {"response": str(data), "mental_state": "neutral", "tasks": []}
            
            if "response" not in data:
                data["response"] = "I'm here, but I had trouble processing that thought."
            if "mental_state" not in data:
                data["mental_state"] = "neutral"
            if "tasks" in data and not isinstance(data["tasks"], list):
                data["tasks"] = []
                
            # Validate tasks items
            valid_tasks = []
            if "tasks" in data:
                for t in data["tasks"]:
                    if isinstance(t, dict) and "description" in t:
                        valid_tasks.append(t)
            data["tasks"] = valid_tasks

            return data

        except (json.JSONDecodeError, ValueError) as e:
            # Fallback for parsing errors
            print(f"⚠️ Parsing Error: {e}. Returning raw text.")
            return {
                "response": raw_response,
                "mental_state": "unknown",
                "tasks": []
            }

        except requests.exceptions.Timeout:
            print("❌ LLM Request Timed Out")
            return {
                "error": "Timeout",
                "mental_state": "fatigue",
                "response": "I'm thinking a bit too slowly right now. My local brain might need a moment to warm up."
            }
        except Exception as e:
            print(f"❌ Error: {e}")
            return {
                "error": str(e),
                "mental_state": "confusion",
                "response": f"I encountered an error processing your thought: {str(e)}"
            }
