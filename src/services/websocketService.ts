export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

export class WebSocketChatService {
  private websocket: WebSocket | null = null;
  private chatId: string;
  private systemPrompt: string;

  constructor(systemPrompt: string) {
    this.chatId = crypto.randomUUID();
    this.systemPrompt = systemPrompt;
  }

  connect(
    message: string,
    onMessage: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: string) => void,
    isInitial: boolean = false,
  ): void {
    const url = "wss://backend.buildpicoapps.com/api/chatbot/chat";

    this.websocket = new WebSocket(url);

    this.websocket.addEventListener("open", () => {
      if (this.websocket) {
        this.websocket.send(
          JSON.stringify({
            chatId: this.chatId,
            appId: "night-along",
            systemPrompt: this.systemPrompt,
            message: isInitial
              ? "A very short welcome message from Dominic Toretto"
              : message,
          }),
        );
      }
    });

    this.websocket.onmessage = (event) => {
      onMessage(event.data);
    };

    this.websocket.onclose = (event) => {
      if (event.code === 1000) {
        onComplete();
      } else {
        onError(
          "Error getting response from server. Refresh the page and try again.",
        );
        onComplete();
      }
    };

    this.websocket.onerror = () => {
      onError("WebSocket connection error");
      onComplete();
    };
  }

  disconnect(): void {
    if (this.websocket) {
      this.websocket.close(1000);
      this.websocket = null;
    }
  }

  isConnected(): boolean {
    return (
      this.websocket !== null && this.websocket.readyState === WebSocket.OPEN
    );
  }
}
