export const getRecommendedStyles = (profile) => {
    // profile = { wpm: number, asrsScore: number, crowdingSensitivity: boolean }

    // Default / Base Settings
    let settings = {
        fontSize: 18,
        lineHeight: 1.6,
        letterSpacing: 0,
        maxWidth: 800,
        fontFamily: 'Inter',
        theme: 'light',
        focusMode: false
    };

    // 1. Dyslexia / Crowding Logic
    if (profile.crowdingSensitivity) {
        settings.letterSpacing = 0.5; // Open up tracking
        settings.lineHeight = 2.0;    // More breathing room
        settings.maxWidth = 600;      // Narrower column
        // In a real app, we might switch to OpenDyslexic here
        // settings.fontFamily = 'OpenDyslexic'; 
    }

    // 2. ADHD / Attention Logic (High ASRS score)
    if (profile.asrsScore > 10) { // Arbitrary threshold
        settings.focusMode = true; // Auto-enable focus mode
        settings.theme = 'warm';   // Calmer background
    }

    // 3. Speed Reader Logic (High WPM)
    if (profile.wpm > 300) {
        settings.maxWidth = 900; // Wider peripheral view for fast readers
    } else if (profile.wpm < 150) {
        settings.fontSize = 20;  // Larger text for ease
    }

    return settings;
};
