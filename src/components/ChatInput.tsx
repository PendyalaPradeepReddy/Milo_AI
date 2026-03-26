import React, { useState } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onCancel,
  isLoading = false,
}) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput("");
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        gap: "0.75rem",
        padding: "0.75rem",
        alignItems: "flex-end",
        background: "rgba(255, 255, 255, 0.9)",
        borderRadius: "1.5rem",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0,0,0,0.02)",
        border: "1px solid rgba(0,0,0,0.05)",
        backdropFilter: "blur(20px)",
        transition: "all 0.3s ease",
      }}
    >
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Message Milo... (Shift+Enter for new line)"
        disabled={isLoading}
        rows={1}
        style={{
          flex: 1,
          padding: "0.75rem 1rem",
          borderRadius: "1rem",
          resize: "none",
          fontSize: "0.95rem",
          maxHeight: "150px",
          minHeight: "48px",
          background: "transparent",
          border: "none",
          outline: "none",
          color: "#1e293b",
          fontFamily: "inherit",
          lineHeight: "1.5",
          opacity: isLoading ? 0.6 : 1,
        }}
        onFocus={(e) => {
          e.currentTarget.parentElement!.style.boxShadow =
            "0 4px 25px rgba(99, 102, 241, 0.15), 0 1px 3px rgba(99, 102, 241, 0.1)";
          e.currentTarget.parentElement!.style.borderColor =
            "rgba(99, 102, 241, 0.3)";
        }}
        onBlur={(e) => {
          e.currentTarget.parentElement!.style.boxShadow =
            "0 4px 20px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0,0,0,0.02)";
          e.currentTarget.parentElement!.style.borderColor = "rgba(0,0,0,0.05)";
        }}
      />
      {isLoading ? (
        <button
          type="button"
          onClick={handleCancel}
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontWeight: "bold",
            fontSize: "1.125rem",
            background: "linear-gradient(135deg, #ef4444, #dc2626)",
            border: "none",
            color: "white",
            boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
            cursor: "pointer",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.05) translateY(-2px)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "scale(1) translateY(0)")
          }
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
          onMouseUp={(e) =>
            (e.currentTarget.style.transform = "scale(1.05) translateY(-2px)")
          }
          title="Stop generating"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        </button>
      ) : (
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontWeight: "bold",
            fontSize: "1.125rem",
            background: !input.trim()
              ? "rgba(241, 245, 249, 1)"
              : "linear-gradient(135deg, #6366f1, #4f46e5)",
            border: "none",
            color: !input.trim() ? "rgba(148, 163, 184, 0.8)" : "white",
            boxShadow: !input.trim()
              ? "none"
              : "0 4px 12px rgba(99, 102, 241, 0.3)",
            cursor: !input.trim() || isLoading ? "not-allowed" : "pointer",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onMouseEnter={(e) => {
            if (!(!input.trim() || isLoading))
              e.currentTarget.style.transform = "scale(1.05) translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            if (!(!input.trim() || isLoading))
              e.currentTarget.style.transform = "scale(1) translateY(0)";
          }}
          onMouseDown={(e) => {
            if (!(!input.trim() || isLoading))
              e.currentTarget.style.transform = "scale(0.95)";
          }}
          onMouseUp={(e) => {
            if (!(!input.trim() || isLoading))
              e.currentTarget.style.transform = "scale(1.05) translateY(-2px)";
          }}
          title="Send message"
        >
          <svg
            style={{ marginLeft: "2px" }}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"
              fill="currentColor"
            />
          </svg>
        </button>
      )}
    </form>
  );
};

export default ChatInput;
