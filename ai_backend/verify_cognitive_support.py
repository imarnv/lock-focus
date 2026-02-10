
import sys
import os

# Add the backend directory to path
sys.path.append(os.path.dirname(__file__))

from executive_engine import ExecutiveEngine
from memory_manager import MemoryManager

def test_panic_detection():
    print("Testing Panic Detection...")
    engine = ExecutiveEngine()
    state, instruction, response = engine.analyze_input("I'm panicking, help me breathe", [])
    assert state == "panic"
    assert "GROUNDING ACTION" in instruction
    assert "NO TASKS" in instruction
    print("Panic Detection passed")

def test_loop_prevention():
    print("Testing Loop Prevention...")
    engine = ExecutiveEngine()
    # First time
    state, instruction, response = engine.analyze_input("I don't know", [])
    assert state == "confusion"
    
    # Second time
    state, instruction, response = engine.analyze_input("I just don't know", [])
    assert state == "loop_broken"
    assert "EXECUTIVE DECISION REQUIRED" in instruction
    print("Loop Prevention passed")

def test_fatigue_handling():
    print("Testing Fatigue Handling...")
    engine = ExecutiveEngine()
    state, instruction, response = engine.analyze_input("I'm exhausted and can't focus", [])
    assert state == "fatigue"
    assert "NO THEORY" in instruction
    assert "Minimal text" in instruction
    print("Fatigue Handling passed")

def test_privacy_filter():
    print("Testing Privacy Filter...")
    memory = MemoryManager()
    memory.clear_history()
    raw_input = "I'm so angry because my project failed. I feel sad."
    memory.add_history("user", raw_input)
    
    history = memory.get_recent_history()
    # It should look something like "I'm so [Emotional expression removed for privacy] because my project failed. [Emotional expression removed for privacy]"
    # Actually the regex is exact: r"i'm so (angry|sad|happy|scared|frustrated)"
    content = history[0]['content']
    assert "[Emotional expression" in content
    assert "angry" not in content.lower()
    assert "sad" not in content.lower()
    print("Privacy Filter passed")

if __name__ == "__main__":
    try:
        test_panic_detection()
        test_loop_prevention()
        test_fatigue_handling()
        test_privacy_filter()
        print("\nALL TESTS PASSED!")
    except AssertionError as e:
        print(f"\nTEST FAILED!")
        sys.exit(1)
    except Exception as e:
        print(f"\nERROR: {e}")
        sys.exit(1)
