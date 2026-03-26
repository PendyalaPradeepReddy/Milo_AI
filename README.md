# Milo AI Chatbot

![Milo AI Chatbot](https://milo-ai-chatbot.netlify.app/) <!-- Replace with actual image url if you have one -->

A fully functional, modern React-based ChatGPT-style AI chatbot that uses WebSocket for real-time streaming conversations.

**🔴 Live Demo:** [Milo AI Chatbot](https://milo-ai-chatbot.netlify.app/)

## 🚀 Features

✨ **Core Capabilities:**
- **Real-time Streaming:** Smooth, token-by-token WebSocket streaming responses for a true AI chat feel.
- **Modern Tech Stack:** Built with React 18, TypeScript, Vite, and styled flawlessly with Tailwind CSS.
- **Session Management:** Session-based chat history and chat ID auto-generation.
- **Rich Text Support:** Markdown rendering out-of-the-box for AI responses.
- **Control Flow:** Powerful message controls including Send, Cancel generation, and New Clear Chat functionality.
- **UI UX:** Clean, responsive design with auto-scroll to the latest messages keeping the conversation focused.

## 📋 Technology Stack

- **React 18** - UI framework
- **TypeScript** - For robust type safety
- **Vite** - High-performance build tool & dev server
- **Tailwind CSS** - Utility-first styling
- **react-markdown** - Secure Markdown rendering
- **WebSocket API** - Persistent real-time backend communication

## 🛠️ Local Development

### Prerequisites
- Node.js (v16+ recommended)
- npm, yarn, or pnpm

### Setup
1. Clone the repository:
   `ash
   git clone https://github.com/PendyalaPradeepReddy/Milo_AI.git
   `
2. Navigate to the project directory:
   `ash
   cd Milo_AI
   `
3. Install dependencies:
   `ash
   npm install
   `
4. Start the development server:
   `ash
   npm run dev
   `

## 🏗️ Architecture Overview

- **App.tsx**: Main application container managing chat state, connection lifecycle, and auto-scrolling capabilities.
- **ChatMessage.tsx**: Responsible for rendering user and AI chat bubbles, applying markdown styling and managing streaming content updates dynamically. 
- **ChatInput.tsx**: Handles user input with dynamic 'Send' and 'Cancel generation' buttons.
- **websocketService.ts**: The core service layer wrapping the native WebSocket API, managing connections, disconnection, stream chunk accumulation, and state.

---
Built with ❤️ by Pradeep Reddy
