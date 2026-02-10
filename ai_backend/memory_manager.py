
import sqlite3
import json
from datetime import datetime
import os
import re

DB_PATH = os.path.join(os.path.dirname(__file__), "memory.db")

class MemoryManager:
    def __init__(self):
        self._init_db()

    def _init_db(self):
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # 1. User Profile (Preferences)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS user_profile (
                key TEXT PRIMARY KEY,
                value TEXT,
                updated_at TIMESTAMP
            )
        ''')
        
        # 2. Selective History (Minimalist)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                role TEXT,
                content TEXT,
                timestamp TIMESTAMP
            )
        ''')
        
        # 3. Cognitive patterns (The "External Brain")
        # Stores: confusing_topics, preferred_style, triggers, focus_hours
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS cognitive_patterns (
                pattern_type TEXT PRIMARY KEY,
                data TEXT,
                confidence REAL,
                updated_at TIMESTAMP
            )
        ''')
        
        # 4. Active Tasks (Current Focus)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                description TEXT,
                priority TEXT,
                status TEXT,
                created_at TIMESTAMP
            )
        ''')
        
        conn.commit()
        conn.close()

    def get_profile(self):
        """Returns all profile and pattern data for the LLM context."""
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute("SELECT key, value FROM user_profile")
        profile = {row[0]: row[1] for row in cursor.fetchall()}
        
        cursor.execute("SELECT pattern_type, data FROM cognitive_patterns")
        patterns = {row[0]: row[1] for row in cursor.fetchall()}
        
        conn.close()
        return {**profile, "patterns": patterns}

    def add_history(self, role, content):
        """Stores history but STRIPS raw emotional content."""
        if role == "user":
            # PRIVACY FILTER: Remove highly emotional venting or personal raw feelings
            # We keep the "what" but lose the "raw emotion"
            emotion_patterns = [
                r"i feel (.*?)\.", 
                r"i'm so (angry|sad|happy|scared|frustrated)",
                r"i hate (.*?)",
                r"i love (.*?)"
            ]
            for p in emotion_patterns:
                content = re.sub(p, "[Emotional expression removed for privacy]", content, flags=re.IGNORECASE)

        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        if isinstance(content, (list, dict)):
            content = json.dumps(content)
            
        cursor.execute(
            "INSERT INTO history (role, content, timestamp) VALUES (?, ?, ?)",
            (role, content, datetime.now())
        )
        # Keep only last 50 entries to avoid "storing everything"
        cursor.execute("DELETE FROM history WHERE id NOT IN (SELECT id FROM history ORDER BY timestamp DESC LIMIT 50)")
        
        conn.commit()
        conn.close()

    def update_pattern(self, pattern_type, data, confidence=0.5):
        """Stores stable cognitive patterns instead of raw data."""
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT OR REPLACE INTO cognitive_patterns (pattern_type, data, confidence, updated_at) VALUES (?, ?, ?, ?)",
            (pattern_type, str(data), confidence, datetime.now())
        )
        conn.commit()
        conn.close()

    def sync_tasks(self, task_list):
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM tasks WHERE status != 'completed'")
        for task in task_list:
            cursor.execute(
                "INSERT INTO tasks (description, priority, status, created_at) VALUES (?, ?, ?, ?)",
                (task.get('description'), task.get('priority'), task.get('status', 'active'), datetime.now())
            )
        conn.commit()
        conn.close()

    def get_recent_history(self, limit=10):
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT role, content FROM history ORDER BY timestamp DESC LIMIT ?", (limit,))
        history = [{"role": row[0], "content": row[1]} for row in cursor.fetchall()]
        conn.close()
        return history[::-1]

    def clear_history(self):
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM history")
        cursor.execute("DELETE FROM tasks")
        cursor.execute("DELETE FROM cognitive_patterns")
        conn.commit()
        conn.close()
