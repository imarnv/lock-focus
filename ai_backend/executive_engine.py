
import re
from datetime import datetime, timedelta

class ExecutiveEngine:
    def __init__(self):
        # Persistent metrics
        self.session_start = datetime.now()
        self.last_interaction = datetime.now()
        self.fatigue = 0 # 1-10
        self.stress = 0 # 1-10
        self.motivation = 5 # 1-10
        self.confidence = 5 # 1-10
        self.task_streak = 0
        self.consecutive_skips = 0
        self.mistake_counter = {} # topic -> count
        self.accuracy = 80 # default
        self.study_timer = 0 # cumulative minutes
        self.break_count = 0
        self.visual_pref = False
        self.experience_level = "beginner" # beginner / advanced
        self.syllabus_complete = False

    def analyze_input(self, text, history):
        text = text.lower().strip()
        now = datetime.now()
        self._update_state(text, now)

        # Priority Score Rules (Evaluates Categories 1-5 + Optional)
        # Any rule that fires returns a specific instruction.
        
        # 1. READINESS & STATE (1-15)
        res = self._check_readiness(text)
        if res: return res

        # 2. TIME & FOCUS (16-30)
        res = self._check_time_focus(now)
        if res: return res

        # 3. LEARNING & EXAMS (31-55)
        res = self._check_learning(text)
        if res: return res

        # 4. MOTIVATION & PSYCHOLOGY (56-70)
        res = self._check_psychology(text)
        if res: return res

        # 5. SYSTEM & ADAPTATION (71-90)
        res = self._check_system(text)
        if res: return res

        # 6. EXTENSIONS (91-100)
        res = self._check_extensions(text)
        if res: return res

        return "neutral", None, None

    def _update_state(self, text, now):
        # Update metrics based on mentions
        f = re.search(r"fatigue (\d+)", text)
        if f: self.fatigue = int(f.group(1))
        
        s = re.search(r"stress (\d+)", text)
        if s: self.stress = int(s.group(1))
        
        m = re.search(r"motivation (\d+)", text)
        if m: self.motivation = int(m.group(1))

        if any(w in text for w in ["done", "checked", "got it"]):
            self.task_streak += 1
            self.consecutive_skips = 0
        elif any(w in text for w in ["skip", "cant", "wont"]):
            self.consecutive_skips += 1
            self.task_streak = 0

        self.last_interaction = now

    def _check_readiness(self, text):
        if self.fatigue >= 7: return "overwhelmed", "FATIGUE HIGH (Rule 1). Reduce task difficulty. Minimal instruction.", None
        if self.fatigue <= 3 and self.fatigue > 0: return "focus", "FATIGUE LOW (Rule 2). High-focus tasks allowed.", None
        if self.task_streak >= 3: return "praise", "3 CONSECUTIVE TASKS (Rule 4). Show encouragement message.", None
        if self.consecutive_skips >= 2: return "light", "2 SKIPS (Rule 5). Switch to lighter content immediately.", None
        if self.stress >= 7: return "break", "STRESS HIGH (Rule 6). Recommend short break.", None
        if "mistake" in text or "wrong" in text:
            topic = text.split()[-1]
            self.mistake_counter[topic] = self.mistake_counter.get(topic, 0) + 1
            if self.mistake_counter[topic] == 2: return "hint", "REPEATED MISTAKE (Rule 10). Provide hint.", None
            if self.mistake_counter[topic] >= 3: return "teach", "3 MISTAKES (Rule 11). Provide full direct explanation.", None
        if "help" in text: return "support", "HELP REQUESTED (Rule 12). Pause scoring. Direct guidance only.", None
        return None

    def _check_time_focus(self, now):
        elapsed = (now - self.session_start).total_seconds() / 60
        if elapsed > 90: return "force_quit", "90 MIN LIMIT (Rule 21). Force cooldown. Block heavy tasks.", None
        if elapsed > 45: return "low_cog", "45 MIN MARK (Rule 20). Reduce cognitive load. Short lines.", None
        if elapsed > 25: return "break_opt", "25 MIN MARK (Rule 16). Suggest 5 min break.", None
        
        # Time of day
        hour = now.hour
        if hour >= 22 or hour <= 4: return "night", "NIGHT STUDY (Rule 29). Avoid analytics. Minimal intensity.", None
        if 5 <= hour <= 9: return "morning", "MORNING START (Rule 30). Prioritize memory-heavy topics.", None
        return None

    def _check_learning(self, text):
        if self.accuracy < 50: return "reteach", "ACCURACY < 50 (Rule 31). Re-teach fundamentals.", None
        if self.accuracy >= 80: return "strong", "ACCURACY HIGH (Rule 32). Mark as strong topic.", None
        
        if any(w in text for w in ["exam in 2 days", "exam soon", "test Monday"]):
            return "exam_urgent", "EXAM < 3 DAYS (Rule 42). Avoid new topics. Revision only.", None
        
        if "formula" in text: return "mnemonic", "FORMULA STRUGGLE (Rule 43). Introduce memory aids.", None
        if "theory" in text: return "example", "THEORY STRUGGLE (Rule 44). Introduce concrete examples.", None
        return None

    def _check_psychology(self, text):
        if self.motivation < 3: return "prog_sum", "MOTIVATION LOW (Rule 56). Show progress summary.", None
        if any(w in text for w in ["overwhelmed", "cant do this"]): return "re-scope", "OVERWHELMED (Rule 58). Reduce scope immediately.", None
        if any(w in text for w in ["anxious", "scared"]): return "normalize", "ANXIETY (Rule 59). Normalize emotion. One grounding step.", None
        if any(w in text for w in ["hating this", "burnout"]): return "firewall", "BURNOUT (Rule 64). Enforce rest. Lock heavy tasks.", None
        return None

    def _check_system(self, text):
        if "not sure" in text: return "simple", "SYSTEM UNCERTAINTY (Rule 90). Choose simplest path.", None
        if "reset" in text: return "onboard", "DATA RESET (Rule 83). Restart onboarding flow.", None
        if self.syllabus_complete: return "mock", "SYLLABUS COMPLETE (Rule 49). Shift to mock test mode.", None
        
        # Plateaus and Improvement
        if "stuck at" in text or "not improving" in text:
            return "change_strategy", "PLATEAU DETECTED (Rule 50). Change strategy. Introduce new learning format.", None
        if "improving fast" in text or "too easy" in text:
            return "accelerate", "RAPID IMPROVEMENT (Rule 86). Accelerate roadmap. Unlock advanced content.", None
            
        # Conflicting rules
        if self.fatigue >= 7 and self.accuracy >= 80:
            return "safety_first", "CONFLICT: FATIGUE vs HIGH ACCURACY (Rule 73). Choose safety-first: Stress reduction overrides progress.", None

        return None, None

    def _check_extensions(self, text):
        if text.startswith("why"): return "explain_logic", "RULE LOGIC (Rule 91). Explain the systemic reason for this choice.", None
        if "diagram" in text or "show me" in text: self.visual_pref = True
        if self.visual_pref: return "visual", "USER PREFERS VISUALS (Rule 93). Use arrows and ASCII structural aids.", None
        
        # Beginner/Advanced
        if self.experience_level == "beginner": 
            return "beginner", "BEGINNER MODE (Rule 97). Limit rule chaining. One step at a time.", None
        if self.experience_level == "advanced":
            return "advanced", "ADVANCED MODE (Rule 98). Allow compound rules and high-density information.", None
            
        return None, None
