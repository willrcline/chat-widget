// Simplified service that works with useConversation hook
// This matches the working pattern from Test.jsx

export const AGENT_ID = "agent_7401k4jzgz0nen7rjtftyc3mhgx7";

// Simple helper function to send messages via conversation object
export function sendMessage(conversation, message) {
  if (conversation.status === "connected") {
    conversation.sendUserMessage(message);
    return true;
  } else {
    console.warn("Cannot send message - connection not ready. Status:", conversation.status);
    return false;
  }
}

// Helper function to start a conversation session
export async function startConversationSession(conversation) {
  try {
    await conversation.startSession({
      agentId: AGENT_ID,
    });
    return true;
  } catch (error) {
    console.error("Failed to start conversation:", error);
    return false;
  }
}

// Helper function to end a conversation session
export async function endConversationSession(conversation) {
  try {
    await conversation.endSession();
    return true;
  } catch (error) {
    console.error("Failed to end conversation:", error);
    return false;
  }
}
