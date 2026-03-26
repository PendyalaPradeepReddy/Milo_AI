const fs = require("fs");
let code = fs.readFileSync("src/services/mockAI.ts", "utf8");
code = code.replace("_userMessage: string", "userMessage: string");
code = code.replace("// We're intentionally not using the parameter in the mock", "// Use it vaguely or ignore\n      const _ = userMessage;");
fs.writeFileSync("src/services/mockAI.ts", code);
