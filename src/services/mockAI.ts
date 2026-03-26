const responses = [
  "That's an interesting question! I appreciate you asking. Let me provide a helpful response.",
  "# Great Question!\n\nHere's what I think about that:\n\n- This is an important point\n- You might also consider this angle\n- Another perspective to explore\n\nWould you like me to elaborate on any of these?",
  "I understand what you're getting at. Here's my take:\n\n```\nExample code snippet\nshowing the concept\n```\n\nDoes this help clarify things?",
  "Absolutely! That's a common question. Let me break it down:\n\n## The Basics\n\nFirst, understand this fundamental concept.\n\n## Advanced Considerations\n\n- Point one\n- Point two\n- Point three\n\nFeel free to ask follow-up questions!",
  "You've touched on something important. Here's my perspective:\n\n**Key insight:** Focus on understanding the underlying principles first.\n\nThen you can build from there with more complex applications.",
  "Interesting! Based on what you've shared:\n\n1. First consideration\n2. Second consideration  \n3. Third consideration\n\nI'd be happy to dive deeper into any of these areas.",
];

export const generateMockResponse = (/* _userMessage: string */): Promise<string> => {
  return new Promise((resolve) => {
    // Simulate network delay
    const delay = Math.random() * 1000 + 500; // 500-1500ms
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * responses.length);
      resolve(responses[randomIndex]);
    }, delay);
  });
};

export const generateContextualResponse = (
  userMessage: string,
): Promise<string> => {
  return new Promise((resolve) => {
    const delay = Math.random() * 1500 + 800;

    // Simple keyword matching for contextual responses
    const lowercaseMessage = userMessage.toLowerCase();

    let response = responses[Math.floor(Math.random() * responses.length)];

    if (lowercaseMessage.includes("hello") || lowercaseMessage.includes("hi")) {
      response = "👋 Hello! I'm your AI assistant. How can I help you today?";
    } else if (lowercaseMessage.includes("how are you")) {
      response =
        "I'm doing great, thanks for asking! I'm here and ready to help with whatever you need. What's on your mind?";
    } else if (
      lowercaseMessage.includes("help") ||
      lowercaseMessage.includes("what can you do")
    ) {
      response =
        "# How I Can Help\n\nI'm an AI assistant that can:\n\n- Answer questions on various topics\n- Explain complex concepts\n- Provide suggestions and advice\n- Help brainstorm ideas\n- Discuss almost anything you'd like\n\nJust ask me anything!";
    } else if (lowercaseMessage.includes("thank")) {
      response =
        "You're welcome! Happy to help. Is there anything else you'd like to know?";
    } else if (
      lowercaseMessage.includes("bye") ||
      lowercaseMessage.includes("goodbye")
    ) {
      response =
        "Goodbye! Feel free to come back anytime you need assistance. Have a great day!";
    }

    setTimeout(() => {
      resolve(response);
    }, delay);
  });
};
