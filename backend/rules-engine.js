import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load rule definitions
const rulesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'rule-definitions.json'), 'utf-8')
);

/**
 * Rule-Based Engine for ADHD Support Chatbot
 * Scans user input for triggers and returns matching rules
 */
class RulesEngine {
  constructor() {
    this.rules = rulesData.rules;
  }

  /**
   * Analyze user input and find matching rules
   * @param {string} userInput - The user's message
   * @returns {Array} - Array of matching rules, sorted by priority (highest first)
   */
  analyzeInput(userInput) {
    const input = userInput.toLowerCase();
    const matchedRules = [];

    for (const rule of this.rules) {
      // Check if any trigger matches
      const hasMatch = rule.triggers.some(trigger => {
        // Handle regex patterns (if trigger starts with /)
        if (trigger.startsWith('/') && trigger.endsWith('/')) {
          const pattern = new RegExp(trigger.slice(1, -1), 'i');
          return pattern.test(input);
        }
        // Simple keyword matching with word boundaries
        const pattern = new RegExp(`\\b${trigger}\\b`, 'i');
        return pattern.test(input);
      });

      if (hasMatch) {
        matchedRules.push(rule);
      }
    }

    // Sort by priority (higher priority first)
    matchedRules.sort((a, b) => b.priority - a.priority);

    return matchedRules;
  }

  /**
   * Get the highest priority rule from matched rules
   * @param {Array} matchedRules - Array of matched rules
   * @returns {Object|null} - The highest priority rule or null
   */
  getTopRule(matchedRules) {
    return matchedRules.length > 0 ? matchedRules[0] : null;
  }

  /**
   * Check if input triggers safety net (crisis detection)
   * @param {string} userInput - The user's message
   * @returns {boolean} - True if safety net should be triggered
   */
  isSafetyNetTriggered(userInput) {
    const safetyKeywords = [
      'hopeless', 'give up', 'end it all', 'suicide', 'kill myself',
      'hurt myself', 'self-harm', 'want to die', 'no point'
    ];

    const input = userInput.toLowerCase();
    return safetyKeywords.some(keyword => input.includes(keyword));
  }

  /**
   * Get safety net response
   * @returns {Object} - Safety net response object
   */
  getSafetyNetResponse() {
    return {
      response: "I'm not a doctor, but please reach out to a helpline if you need immediate support:\n\n" +
        "🇮🇳 India: AASRA - 91-22-27546669\n" +
        "🇺🇸 USA: 988 Suicide & Crisis Lifeline\n" +
        "🇬🇧 UK: Samaritans - 116 123\n\n" +
        "You're not alone. Let's focus on what I can help with now – what's one small thing we can tackle together? 💙",
      action: 'safety_net',
      priority: 100
    };
  }

  /**
   * Detect if input contains multiple tasks
   * @param {string} userInput - The user's message
   * @returns {boolean} - True if multiple tasks detected
   */
  hasMultipleTasks(userInput) {
    // Look for task indicators separated by commas, "and", or line breaks
    const taskPatterns = [
      /,\s*(?:and\s+)?/g,  // Comma separated
      /\s+and\s+/g,         // "and" separated
      /\n/g,                // Line breaks
      /;\s*/g               // Semicolon separated
    ];

    let taskCount = 1;
    for (const pattern of taskPatterns) {
      const matches = userInput.match(pattern);
      if (matches) {
        taskCount += matches.length;
      }
    }

    // Also check for task keywords
    const taskKeywords = ['need to', 'have to', 'must', 'should', 'got to', 'gotta'];
    const keywordMatches = taskKeywords.filter(keyword =>
      userInput.toLowerCase().includes(keyword)
    ).length;

    return taskCount > 2 || keywordMatches > 1;
  }
}

export default RulesEngine;
