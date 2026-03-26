const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const t = '          </div>\r\n        </div>\r\n\r\n      {/* Main Content */}';
const t2 = '          </div>\n        </div>\n\n      {/* Main Content */}';

const rep = `          </div>
          {savedChats.length > 0 && (
            <div style={{ padding: "0.75rem", borderTop: "1px solid #334155", minWidth: "260px" }}>
              <button 
                onClick={clearAllChats}
                style={{
                  width: "100%", padding: "0.75rem", background: "transparent", color: "#ef4444", 
                  border: "none", borderRadius: "0.5rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem",
                  fontWeight: 500, transition: "background 0.2s", fontSize: "0.875rem"
                }}
                onMouseOver={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"}
                onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
              >
                <span>???</span> Clear conversations
              </button>
            </div>
          )}
        </div>

      {/* Main Content */}`;

if(code.indexOf(t) > -1) { code = code.replace(t, rep); }
else if(code.indexOf(t2) > -1) { code = code.replace(t2, rep); }

fs.writeFileSync('src/App.tsx', code);
