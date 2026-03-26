const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const clearAllChatsFunc = `
  const clearAllChats = () => {
    if (window.confirm('Are you sure you want to clear all conversations? This cannot be undone.')) {
      try {
        savedChats.forEach(chat => localStorage.removeItem(chat.id));
        localStorage.removeItem(ALL_CHATS_KEY);
        setSavedChats([]);
        startNewChat();
      } catch (err) {
        console.error('Failed to clear conversations', err);
      }
    }
  };
`;

code = code.replace(
  'const handleSendMessage = (content: string) => {',
  clearAllChatsFunc + '\n  const handleSendMessage = (content: string) => {'
);

const clearChatsButton = `
        {savedChats.length > 0 && (
          <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid #334155', minWidth: '260px' }}>
            <button 
              onClick={clearAllChats}
              style={{
                width: '100%', padding: '0.75rem', background: 'transparent', color: '#ef4444', 
                border: 'none', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
                fontWeight: 500, transition: 'background 0.2s', fontSize: '0.875rem'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span>???</span> Clear conversations
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}`;

code = code.replace( // Need exact match for the end of Sidebar div and Main Content start
  /          <\/div>\n        <\/div>\n\n      \{\/\* Main Content \*\/\}/g,
  '          </div>\n' + clearChatsButton
);

fs.writeFileSync('src/App.tsx', code);
