const fs = require("fs");
let c = fs.readFileSync("src/App.tsx", "utf8");
c = c.replace(
  '<main className="chat-container">',
  '<main className="chat-container" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>',
);
c = c.replace(
  '<div className="messages-area">',
  '<div className="messages-area" style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>',
);
fs.writeFileSync("src/App.tsx", c);
