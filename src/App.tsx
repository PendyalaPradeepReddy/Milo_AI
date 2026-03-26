import { useState, useRef, useEffect } from "react";
import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";
import { WebSocketChatService } from "./services/websocketService";
import "./App.css";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  date: string;
  preview: string;
}

const SYSTEM_PROMPT =
  "You are Milo, a friendly and helpful AI assistant. You're knowledgeable, thoughtful, and always ready to help with any questions or topics.";
const ALL_CHATS_KEY = "milo_all_chats_v2"; // updated key to avoid parsing errors with old format

const getChatId = () => `chat-${Date.now()}`;
const getMsgId = (suffix?: string) =>
  `msg-${Date.now()}${suffix ? "-" + suffix : ""}`;

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [savedChats, setSavedChats] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsServiceRef = useRef<WebSocketChatService | null>(null);

  const loadSavedChats = (): ChatSession[] => {
    try {
      const allChats = localStorage.getItem(ALL_CHATS_KEY);
      if (allChats) return JSON.parse(allChats);
    } catch (e) {
      console.error(e);
    }
    return [];
  };

  const loadChat = (chatId: string) => {
    if (isLoading) wsServiceRef.current?.disconnect();
    try {
      const saved = localStorage.getItem(chatId);
      if (saved) {
        const parsed = JSON.parse(saved).map(
          (m: Omit<Message, "timestamp"> & { timestamp: string | Date }) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          }),
        );
        setMessages(parsed);
        setCurrentChatId(chatId);
        setIsLoading(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const startNewChat = () => {
    wsServiceRef.current?.disconnect();
    setIsLoading(false);

    const newId = getChatId();
    setCurrentChatId(newId);

    const welcomeId = getMsgId("welcome");
    setMessages([
      { id: welcomeId, role: "assistant", content: "", timestamp: new Date() },
    ]);
    setIsLoading(true);

    wsServiceRef.current = new WebSocketChatService(SYSTEM_PROMPT);
    wsServiceRef.current.connect(
      "",
      (chunk) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === welcomeId ? { ...m, content: m.content + chunk } : m,
          ),
        );
      },
      () => setIsLoading(false),
      (error) => {
        setMessages([
          {
            id: getMsgId("error"),
            role: "assistant",
            content: error,
            timestamp: new Date(),
          },
        ]);
        setIsLoading(false);
      },
      true,
    );
  };

  const deleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    try {
      localStorage.removeItem(chatId);
      const allChats = loadSavedChats();
      const allChatsFiltered = allChats.filter((c) => c.id !== chatId);
      localStorage.setItem(ALL_CHATS_KEY, JSON.stringify(allChatsFiltered));
      setSavedChats(allChatsFiltered);

      if (currentChatId === chatId) {
        if (allChatsFiltered.length > 0) loadChat(allChatsFiltered[0].id);
        else startNewChat();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const clearAllChats = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all conversations? This cannot be undone.",
      )
    ) {
      try {
        savedChats.forEach((chat) => localStorage.removeItem(chat.id));
        localStorage.removeItem(ALL_CHATS_KEY);
        setSavedChats([]);
        startNewChat();
      } catch (err) {
        console.error("Failed to clear conversations", err);
      }
    }
  };

  useEffect(() => {
    wsServiceRef.current = new WebSocketChatService(SYSTEM_PROMPT);
    const chats = loadSavedChats();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSavedChats(chats);

    if (chats.length > 0) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      loadChat(chats[0].id);
    } else {
      startNewChat();
    }

    return () => wsServiceRef.current?.disconnect();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-save current chat whenever messages change
  useEffect(() => {
    if (!currentChatId || messages.length === 0) return;

    // Don't save if it's just the empty welcome message
    if (messages.length === 1 && messages[0].content === "") {
      return;
    }

    try {
      localStorage.setItem(currentChatId, JSON.stringify(messages));

      const allChats = loadSavedChats();
      let preview = messages
        .find((m) => m.role === "user")
        ?.content.substring(0, 30);
      if (!preview) preview = "New Chat";

      const existingIdx = allChats.findIndex((c) => c.id === currentChatId);
      if (existingIdx >= 0) {
        allChats[existingIdx].preview = preview;
      } else {
        allChats.unshift({
          id: currentChatId,
          date: new Date().toLocaleString(),
          preview,
        });
      }
      localStorage.setItem(
        ALL_CHATS_KEY,
        JSON.stringify(allChats.slice(0, 50)),
      ); // Keep last 50
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSavedChats(allChats.slice(0, 50));
    } catch (e) {
      console.error(e);
    }
  }, [messages, currentChatId]);

  const handleSendMessage = (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMsg: Message = {
      id: getMsgId(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };
    const assistId = getMsgId("resp");
    const assistMsg: Message = {
      id: assistId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg, assistMsg]);
    setIsLoading(true);

    wsServiceRef.current?.connect(
      content,
      (chunk) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistId ? { ...m, content: m.content + chunk } : m,
          ),
        );
        scrollToBottom();
      },
      () => setIsLoading(false),
      (err) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === assistId ? { ...m, content: err } : m)),
        );
        setIsLoading(false);
      },
      false,
    );
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        background: "var(--bg-gradient-start, #f8fafc)",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: isSidebarOpen ? "280px" : "0",
          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
          background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          boxShadow: isSidebarOpen ? "2px 0 15px rgba(0,0,0,0.1)" : "none",
          zIndex: 20,
        }}
      >
        <div style={{ padding: "1.25rem 1rem" }}>
          <button
            onClick={startNewChat}
            style={{
              width: "100%",
              padding: "0.875rem",
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "0.5rem",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.95rem",
              fontWeight: "500",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.transform = "none";
            }}
          >
            <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>+</span>{" "}
            New conversation
          </button>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "0 1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <div
            style={{
              fontSize: "0.75rem",
              color: "#94a3b8",
              fontWeight: "600",
              padding: "0.5rem 0",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Recent Chats
          </div>
          {savedChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => loadChat(chat.id)}
              style={{
                padding: "0.875rem",
                borderRadius: "0.5rem",
                background:
                  currentChatId === chat.id
                    ? "rgba(99, 102, 241, 0.2)"
                    : "rgba(255, 255, 255, 0.03)",
                border:
                  currentChatId === chat.id
                    ? "1px solid rgba(99, 102, 241, 0.5)"
                    : "1px solid transparent",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "0.9rem",
                whiteSpace: "nowrap",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                if (currentChatId !== chat.id)
                  e.currentTarget.style.background =
                    "rgba(255, 255, 255, 0.08)";
              }}
              onMouseOut={(e) => {
                if (currentChatId !== chat.id)
                  e.currentTarget.style.background =
                    "rgba(255, 255, 255, 0.03)";
              }}
            >
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  opacity: currentChatId === chat.id ? 1 : 0.8,
                  fontWeight: currentChatId === chat.id ? "500" : "400",
                }}
              >
                💬 {chat.preview}
              </span>
              <button
                onClick={(e) => deleteChat(e, chat.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                  padding: "0.25rem",
                  fontSize: "1.1rem",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "24px",
                  height: "24px",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = "#ef4444";
                  e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = "#94a3b8";
                  e.currentTarget.style.background = "transparent";
                }}
                title="Delete chat"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div
          style={{
            padding: "1rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <button
            onClick={clearAllChats}
            style={{
              width: "100%",
              padding: "0.875rem",
              background: "transparent",
              border: "none",
              color: "#fb7185",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.9rem",
              textAlign: "left",
              borderRadius: "0.5rem",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.background = "rgba(251, 113, 133, 0.1)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <span style={{ fontSize: "1.1rem" }}>🗑</span> Clear conversations
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          minWidth: 0, // prevents flex overflow
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            padding: "1rem 1.5rem",
            background: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
            boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
            position: "sticky",
            top: 0,
            zIndex: 10,
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "0.375rem",
              cursor: "pointer",
              padding: "0.5rem 0.75rem",
              color: "#334155",
              fontSize: "1.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              marginRight: "1rem",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#f8fafc")}
            onMouseOut={(e) => (e.currentTarget.style.background = "white")}
            title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? "◀" : "☰"}
          </button>

          <div style={{ flex: 1 }}>
            <h1
              style={{
                margin: 0,
                fontSize: "1.5rem",
                color: "#0f172a",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span
                style={{
                  fontSize: "1.75rem",
                  background: "linear-gradient(135deg, #6366f1, #3b82f6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Milo
              </span>
            </h1>
            <p
              style={{
                margin: "0.25rem 0 0 0",
                color: "#64748b",
                fontSize: "0.875rem",
                fontWeight: "500",
              }}
            >
              Your intelligent conversational partner
            </p>
          </div>
        </header>

        <main
          className="chat-container"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            background:
              "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wMykiLz48L3N2Zz4') top left",
          }}
        >
          <div
            className="messages-area"
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              scrollBehavior: "smooth",
            }}
          >
            <div
              style={{
                maxWidth: "800px",
                margin: "0 auto",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              {messages.length === 1 && messages[0].content === "" && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "4rem 2rem",
                    opacity: 0.8,
                    marginTop: "2rem",
                  }}
                >
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                    👋
                  </div>
                  <h2
                    style={{
                      fontSize: "1.5rem",
                      color: "#334155",
                      margin: "0 0 0.5rem 0",
                    }}
                  >
                    Welcome to Milo!
                  </h2>
                  <p style={{ color: "#64748b", margin: 0 }}>
                    Start a conversation by typing a message below.
                  </p>
                </div>
              )}
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} style={{ height: 40, flexShrink: 0 }} />
            </div>
          </div>
          <div
            className="input-area"
            style={{
              padding: "1.5rem",
              flexShrink: 0,
              background:
                "linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 80%, transparent 100%)",
              borderTop: "1px solid rgba(0,0,0,0.02)",
            }}
          >
            <div
              className="input-container"
              style={{
                maxWidth: "800px",
                margin: "0 auto",
                position: "relative",
              }}
            >
              <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                onCancel={() => {
                  wsServiceRef.current?.disconnect();
                  setIsLoading(false);
                }}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
