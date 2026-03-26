const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const t = `  const handleSendMessage = (content: string) => {`;
const rep = `  const clearAllChats = () => {
    if (window.confirm("Are you sure you want to clear all conversations? This cannot be undone.")) {
      try {
        savedChats.forEach(chat => localStorage.removeItem(chat.id));
        localStorage.removeItem(ALL_CHATS_KEY);
        setSavedChats([]);
        startNewChat();
      } catch (err) {
        console.error("Failed to clear conversations", err);
      }
    }
  };

  const handleSendMessage = (content: string) => {`;

if (!code.includes("const clearAllChats")) {
  code = code.replace(t, rep);
}

fs.writeFileSync('src/App.tsx', code);
