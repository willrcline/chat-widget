import { useConversation } from "@elevenlabs/react";
import { useCallback } from "react";
import { minimalSendUserMessage } from '../services/elevenLabsService'

export function Conversation() {
  const conversation = useConversation({
    onConnect: () => console.log("Connected"),
    onDisconnect: () => console.log("Disconnected"),
    onMessage: (message) => console.log("Message:", message),
    onError: (error) => console.error("Error:", error),
  });

  // const { status, sendUserMessage } = useConversation();


  const handleSendMessage = () => {
    console.log("send message btn clicked")
    const message = "If you receive this message, tell me what 2 + 2 is.";
    if (conversation.status === "connected") {
      conversation.sendUserMessage(message);
    } else {
      console.warn("Cannot send message - connection not ready. Status:", status);
    }
    // () => minimalSendUserMessage(conversation, message)
  }

  const startConversation = useCallback(async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Start the conversation with your agent
      await conversation.startSession({
        agentId: "agent_6701k3f4ynb0f32tapzgnf9yhc5n", // Replace with your agent ID

        // user_id: "YOUR_CUSTOMER_USER_ID", // Optional field for tracking your end user IDs
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        <button
          onClick={startConversation}
          disabled={conversation.status === "connected"}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Start Conversation
        </button>
        <button
          onClick={stopConversation}
          disabled={conversation.status !== "connected"}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-300"
        >
          Stop Conversation
        </button>
        <button
          onClick={handleSendMessage}
          disabled={conversation.status !== "connected"}
        >
          Send Text
        </button>
      </div>

      <div className="flex flex-col items-center">
        <p>Status: {conversation.status}</p>
        <p>Agent is {conversation.isSpeaking ? "speaking" : "listening"}</p>
      </div>
    </div>
  );
}
