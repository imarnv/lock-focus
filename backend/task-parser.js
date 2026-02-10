/**
 * Task Parser for ADHD Support Chatbot
 * Extracts and categorizes tasks from user input
 */
class TaskParser {
    constructor() {
        this.urgencyKeywords = {
            urgent: ['meds', 'medication', 'pills', 'prescription', 'emergency', 'asap', 'right now', 'immediately'],
            high: ['exam', 'test', 'quiz', 'deadline', 'due', 'tomorrow', 'today', 'tonight', 'submit', 'send', 'upload', 'appointment', 'meeting', 'interview', 'work', 'project', 'assignment', 'pay', 'bill', 'payment'],
            medium: ['email', 'message', 'text', 'call', 'shopping', 'groceries', 'buy', 'prepare', 'pack', 'study', 'read', 'review', 'exercise', 'workout', 'finish', 'complete'],
            low: ['clean', 'laundry', 'dishes', 'organize', 'hobby', 'fun', 'relax', 'someday', 'eventually', 'maybe', 'fix', 'repair']
        };
    }

    /**
     * Extract tasks from user input
     * @param {string} userInput - The user's message
     * @returns {Array} - Array of task objects with text and priority
     */
    extractTasks(userInput) {
        const tasks = [];

        // Split by common separators
        const separators = /[,;]|\s+and\s+|\n/gi;
        const segments = userInput.split(separators).map(s => s.trim()).filter(s => s.length > 0);

        // Look for task indicators
        const taskIndicators = [
            /(?:need to|have to|must|should|got to|gotta)\s+(.+)/gi,
            /(?:i'm|i am)\s+(?:going to|gonna)\s+(.+)/gi,
            /(?:plan to|planning to)\s+(.+)/gi
        ];

        for (const segment of segments) {
            let taskText = segment;
            let isTask = false;

            // Check if segment contains task indicators
            for (const indicator of taskIndicators) {
                const match = indicator.exec(segment);
                if (match) {
                    taskText = match[1] || segment;
                    isTask = true;
                    break;
                }
            }

            // If no explicit indicator, check if segment contains action verbs OR urgency keywords
            const actionVerbs = ['do', 'make', 'write', 'finish', 'complete', 'start', 'begin', 'create', 'send', 'buy', 'get', 'take', 'go', 'call', 'email', 'study', 'read', 'clean', 'organize', 'prepare', 'submit', 'upload', 'pay', 'schedule', 'wash', 'cook', 'bring', 'attend', 'watch', 'listen', 'practice', 'revise', 'learn'];

            if (!isTask) {
                const words = segment.toLowerCase().split(/\s+/);
                // Check action verbs
                if (words.some(word => actionVerbs.includes(word))) {
                    isTask = true;
                    taskText = segment;
                }
                // Check urgency keywords (if it mentions 'exam' or 'deadline', it's likely a task)
                else {
                    const allUrgencyKeywords = [
                        ...this.urgencyKeywords.urgent,
                        ...this.urgencyKeywords.high,
                        ...this.urgencyKeywords.medium,
                        ...this.urgencyKeywords.low
                    ];
                    if (allUrgencyKeywords.some(keyword => segment.toLowerCase().includes(keyword))) {
                        isTask = true;
                        taskText = segment;
                    }
                }
            }

            if (isTask && taskText.length > 3) {
                const priority = this.determinePriority(taskText);
                tasks.push({
                    text: this.cleanTaskText(taskText),
                    priority: priority,
                    completed: false,
                    id: this.generateTaskId()
                });
            }
        }

        // If no tasks found but input seems task-related, treat whole input as one task
        if (tasks.length === 0 && this.seemsLikeTask(userInput)) {
            tasks.push({
                text: this.cleanTaskText(userInput),
                priority: this.determinePriority(userInput),
                completed: false,
                id: this.generateTaskId()
            });
        }

        return tasks;
    }

    /**
     * Determine task priority based on keywords
     * @param {string} taskText - The task text
     * @returns {string} - Priority level: 'urgent', 'high', 'medium', or 'low'
     */
    determinePriority(taskText) {
        const lowerText = taskText.toLowerCase();

        // Check for time indicators
        const timeIndicators = {
            urgent: ['now', 'asap', 'immediately', 'right now', 'emergency'],
            high: ['today', 'tonight', 'tomorrow', 'this morning', 'this afternoon', 'this evening', 'in \\d+ hour', 'in \\d+ min'],
            medium: ['this week', 'next week', 'soon', 'upcoming'],
            low: ['someday', 'eventually', 'maybe', 'later']
        };

        // Check time indicators first
        for (const [priority, indicators] of Object.entries(timeIndicators)) {
            for (const indicator of indicators) {
                const pattern = new RegExp(indicator, 'i');
                if (pattern.test(lowerText)) {
                    return priority;
                }
            }
        }

        // Check urgency keywords
        for (const [priority, keywords] of Object.entries(this.urgencyKeywords)) {
            for (const keyword of keywords) {
                if (lowerText.includes(keyword)) {
                    return priority;
                }
            }
        }

        // Default to medium priority
        return 'medium';
    }

    /**
     * Clean task text (remove task indicators, trim, capitalize)
     * @param {string} taskText - Raw task text
     * @returns {string} - Cleaned task text
     */
    cleanTaskText(taskText) {
        let cleaned = taskText;

        // Remove task indicators
        const indicators = ['need to', 'have to', 'must', 'should', 'got to', 'gotta', 'i\'m going to', 'i am going to', 'gonna', 'plan to', 'planning to'];

        for (const indicator of indicators) {
            const pattern = new RegExp(`^${indicator}\\s+`, 'gi');
            cleaned = cleaned.replace(pattern, '');
        }

        // Trim and capitalize first letter
        cleaned = cleaned.trim();
        if (cleaned.length > 0) {
            cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
        }

        // Remove trailing punctuation except necessary ones
        cleaned = cleaned.replace(/[,;]$/, '');

        return cleaned;
    }

    /**
     * Check if input seems like a task
     * @param {string} input - User input
     * @returns {boolean} - True if input seems task-related
     */
    seemsLikeTask(input) {
        const taskPhrases = ['need to', 'have to', 'must', 'should', 'got to', 'gotta', 'going to', 'gonna', 'plan to', 'want to', 'trying to'];
        const lowerInput = input.toLowerCase();

        return taskPhrases.some(phrase => lowerInput.includes(phrase));
    }

    /**
     * Generate unique task ID
     * @returns {string} - Unique task ID
     */
    generateTaskId() {
        return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Categorize tasks by priority
     * @param {Array} tasks - Array of task objects
     * @returns {Object} - Tasks categorized by priority
     */
    categorizeTasks(tasks) {
        return {
            urgent: tasks.filter(t => t.priority === 'urgent'),
            high: tasks.filter(t => t.priority === 'high'),
            medium: tasks.filter(t => t.priority === 'medium'),
            low: tasks.filter(t => t.priority === 'low')
        };
    }

    /**
     * Format tasks for display
     * @param {Array} tasks - Array of task objects
     * @returns {string} - Formatted task list
     */
    formatTasksForDisplay(tasks) {
        if (tasks.length === 0) return '';

        const categorized = this.categorizeTasks(tasks);
        let output = 'Here\'s your task list organized by priority:\n\n';

        const priorityEmojis = {
            urgent: '🚨',
            high: '🔴',
            medium: '🟡',
            low: '🟢'
        };

        for (const [priority, taskList] of Object.entries(categorized)) {
            if (taskList.length > 0) {
                output += `${priorityEmojis[priority]} **${priority.toUpperCase()}**\n`;
                taskList.forEach((task, index) => {
                    output += `${index + 1}. ${task.text}\n`;
                });
                output += '\n';
            }
        }

        output += 'Let\'s tackle the urgent ones first! Which one should we start with?';
        return output;
    }
}

export default TaskParser;
