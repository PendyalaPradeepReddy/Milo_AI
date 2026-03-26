import React from "react";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div
      style={{
        display: "flex",
        gap: "0.5rem",
        marginBottom: "1.5rem",
        paddingLeft: isUser ? "2rem" : 0,
        paddingRight: isUser ? 0 : "2rem",
        justifyContent: isUser ? "flex-end" : "flex-start",
        animation: "fadeInUp 0.3s ease-out forwards",
      }}
    >
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
      <div
        style={{
          maxWidth: "32rem",
          padding: "0.75rem 1.25rem",
          borderRadius: isUser
            ? "1.25rem 1.25rem 0.25rem 1.25rem"
            : "1.25rem 1.25rem 1.25rem 0.25rem",
          fontSize: "0.95rem",
          lineHeight: 1.6,
          background: isUser
            ? "linear-gradient(135deg, #6366f1, #4f46e5)"
            : "rgba(255, 255, 255, 0.9)",
          color: isUser ? "#ffffff" : "#1e293b",
          border: isUser ? "none" : "1px solid rgba(0, 0, 0, 0.05)",
          backdropFilter: "blur(10px)",
          boxShadow: isUser
            ? "0 4px 15px rgba(79, 70, 229, 0.2)"
            : "0 4px 15px rgba(0, 0, 0, 0.03)",
          wordBreak: "break-word",
        }}
      >
        {isUser ? (
          <p style={{ margin: 0, whiteSpace: "pre-wrap", fontWeight: 500 }}>
            {message.content}
          </p>
        ) : (
          <div>
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p
                    style={{
                      margin: 0,
                      marginBottom: "0.5rem",
                      wordBreak: "break-word",
                    }}
                  >
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul
                    style={{
                      marginLeft: "0.75rem",
                      marginTop: "0.25rem",
                      marginBottom: "0.25rem",
                      listStyleType: "disc",
                      color: "inherit",
                    }}
                  >
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol
                    style={{
                      marginLeft: "0.75rem",
                      marginTop: "0.25rem",
                      marginBottom: "0.25rem",
                      listStyleType: "decimal",
                      color: "inherit",
                    }}
                  >
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li style={{ marginBottom: "0.125rem", color: "inherit" }}>
                    {children}
                  </li>
                ),
                code: ({ children }) => (
                  <code
                    style={{
                      paddingLeft: "0.5rem",
                      paddingRight: "0.5rem",
                      paddingTop: "0.125rem",
                      paddingBottom: "0.125rem",
                      borderRadius: "0.25rem",
                      fontSize: "0.75rem",
                      wordBreak: "break-all",
                      fontFamily: "monospace",
                      background: "rgba(99, 102, 241, 0.1)",
                      color: "#6366f1",
                    }}
                  >
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre
                    style={{
                      paddingLeft: "0.5rem",
                      paddingRight: "0.5rem",
                      paddingTop: "0.5rem",
                      paddingBottom: "0.5rem",
                      borderRadius: "0.25rem",
                      fontSize: "0.75rem",
                      overflowX: "auto",
                      marginTop: "0.5rem",
                      marginBottom: "0.5rem",
                      fontFamily: "monospace",
                      background: "rgba(15, 23, 42, 0.8)",
                      color: "#f1f5f9",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <code style={{ wordBreak: "break-all" }}>{children}</code>
                  </pre>
                ),
                h1: ({ children }) => (
                  <h1
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "bold",
                      marginTop: "0.5rem",
                      marginBottom: "0.5rem",
                      color: "inherit",
                    }}
                  >
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "bold",
                      marginTop: "0.375rem",
                      marginBottom: "0.375rem",
                      color: "inherit",
                    }}
                  >
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      marginTop: "0.25rem",
                      marginBottom: "0.25rem",
                      color: "inherit",
                    }}
                  >
                    {children}
                  </h3>
                ),
                blockquote: ({ children }) => (
                  <blockquote
                    style={{
                      borderLeft: "2px solid rgba(99, 102, 241, 0.3)",
                      paddingLeft: "0.5rem",
                      fontStyle: "italic",
                      marginTop: "0.25rem",
                      marginBottom: "0.25rem",
                      color: "inherit",
                    }}
                  >
                    {children}
                  </blockquote>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      textDecoration: "underline",
                      wordBreak: "break-all",
                      color: isUser ? "#ffffff" : "#6366f1",
                      cursor: "pointer",
                    }}
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
