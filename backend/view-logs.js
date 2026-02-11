import chatStore from './chat-store.js';

async function viewLogs() {
    console.log("🔍 Fetching all chat sessions from JSON storage...");

    // Get raw data (which is the whole JSON object for the file store)
    const allSessions = await chatStore.getDb();
    const sessionIds = Object.keys(allSessions);

    if (sessionIds.length === 0) {
        console.log("⚠️  No chat logs found in chat_history.json.");
        return;
    }

    console.log(`found ${sessionIds.length} sessions.\n`);

    // Sort by last_updated desc
    sessionIds.sort((a, b) => {
        const dateA = new Date(allSessions[a].last_updated || 0);
        const dateB = new Date(allSessions[b].last_updated || 0);
        return dateB - dateA;
    });

    for (const sessionId of sessionIds) {
        const sessionData = allSessions[sessionId];
        console.log(`--- Session: ${sessionId} (${sessionData.last_updated}) ---`);

        // Decrypt using the store's getChat method
        const history = await chatStore.getChat(sessionId);

        if (history && history.length > 0) {
            history.forEach(msg => {
                const role = msg.role.toUpperCase();
                const preview = msg.content.length > 100 ? msg.content.substring(0, 100) + '...' : msg.content;
                console.log(`[${role}]: ${preview}`);
            });
        } else {
            console.log("   (No messages or failed to decrypt)");
        }
        console.log("\n");
    }
}

viewLogs().catch(console.error);
