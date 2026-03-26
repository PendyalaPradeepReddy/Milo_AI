const fs = require("fs");
let code = fs.readFileSync("src/App.tsx", "utf8");

// Re-arrange loadChat and startNewChat before useEffect
const loadChatRegex = /  const loadChat = \([\s\S]*?  \};\n/;
const startNewChatRegex = /  const startNewChat = \(\) => \{[\s\S]*?  \};\n/;

let loadChatMatch = code.match(loadChatRegex);
let startNewRegexMatch = code.match(startNewChatRegex);

if (loadChatMatch && startNewRegexMatch) {
  code = code.replace(loadChatMatch[0], '');
  code = code.replace(startNewRegexMatch[0], '');
  
  const insertTarget = '  const loadSavedChats = (): ChatSession[] => {';
  const toInsert = loadChatMatch[0] + '\n' + startNewRegexMatch[0] + '\n' + insertTarget;
  
  code = code.replace(insertTarget, toInsert);
}

// Fix "let allChats" to "const allChats"
code = code.replace(/let allChats = loadSavedChats\(\);/g, 'const allChats = loadSavedChats();');

// Fix "(m: any)" to "(m: Message)" 
code = code.replace(/\(m: any\)/g, '(m: Omit<Message, \'timestamp\'> & {timestamp: string | Date})');

fs.writeFileSync("src/App.tsx", code);
console.log("Done");
