import { Conversation } from '@elevenlabs/client';

const AGENT_ID = "agent_7401k4jzgz0nen7rjtftyc3mhgx7";

// Store active conversations by sessionId
const conversations = new Map();

// Callback to update UI - will be set by ChatWidget
let onAgentMessage = null;

export function setMessageCallback(callback) {
  onAgentMessage = callback;
}

export async function sendUserMessage(userMessage, sessionId) { 
  try {
    console.log(`ElevenLabs: Sending message from session ${sessionId}: ${userMessage}`);
    
    // Get or create conversation for this session
    let conversation = conversations.get(sessionId);
    
    if (!conversation) {
      conversation = await createConversation(sessionId);
      conversations.set(sessionId, conversation);
      
      // Wait a bit for connection to stabilize
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Check if conversation is still connected
    if (conversation && conversation.status === 'connected') {
      console.log(`Sending user message: ${userMessage}`);
      conversation.sendUserMessage({
        text: userMessage,
      });
    } else {
      console.error('Conversation not connected, status:', conversation?.status);
      // Try to recreate connection
      conversations.delete(sessionId);
      conversation = await createConversation(sessionId);
      conversations.set(sessionId, conversation);
      
      // Wait and try again
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (conversation && conversation.status === 'connected') {
        conversation.sendUserMessage({
          text: userMessage,
        });
      }
    }
    
  } catch (error) {
    console.error('ElevenLabs error:', error);
    // Call the callback with error message
    if (onAgentMessage) {
      onAgentMessage("Sorry, I encountered an error. Please try again.");
    }
  }
}

export async function createConversation(sessionId) {
  console.log(`Creating ElevenLabs conversation for session ${sessionId}`);

  try {
    // Request microphone permission
    await navigator.mediaDevices.getUserMedia({ audio: true });

    const conversation = await Conversation.startSession({
      agentId: AGENT_ID,
      overrides: {
        conversation: {
          textOnly: true,
        },
      },
      onConnect: () => {
        console.log(`ElevenLabs connected for session ${sessionId}`);
      },
      onDisconnect: () => {
        console.log(`ElevenLabs disconnected for session ${sessionId}`);
        // conversations.delete(sessionId);
      },
      onError: (error) => {
        console.error(`ElevenLabs error for session ${sessionId}:`, error);
      },
      onMessage: (message) => {
        console.log(`ElevenLabs message for session ${sessionId}:`, message);
        // Handle agent responses - directly update UI
        // if (message.type === 'agent_response' && onAgentMessage) {
        onAgentMessage(message.message);
        // }
      },
      onModeChange: (mode) => {
        console.log("mode changed___", mode);
      },
    });

    return conversation;
  } catch (error) {
    console.error("Failed to start conversation:", error);
  }
}

export function cleanupConversation(sessionId) {
  const conversation = conversations.get(sessionId);
  if (conversation) {
    conversation.endSession();
    conversations.delete(sessionId);
    console.log(`Cleaned up ElevenLabs conversation for session ${sessionId}`);
  }
}
