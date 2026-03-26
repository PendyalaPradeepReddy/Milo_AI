const fs = require("fs");
let code = fs.readFileSync("src/App.tsx", "utf8");

const replacement = `          ))}
        </div>
        
        {savedChats.length > 0 && (
          <div style={{ padding: "0.75rem 1rem", borderTop: "1px solid #334155", minWidth: "260px" }}>
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

const regex = /          \)\)\}[\s\S]*?\{\/\* Main Content \*\/\}/;
code = code.replace(regex, replacement);

fs.writeFileSync("src/App.tsx", code);
console.log("Done");
