import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const elevenlabs = new ElevenLabsClient({
  apiKey: "sk_06886c91e5990a0b1368f704506d8121ce571b6934a34c46",
});

// Replace with your actual agent ID
const AGENT_ID = "agent_6701k3f4ynb0f32tapzgnf9yhc5n";

// Store active conversation sessions
const conversationSessions = new Map();

export async function getAgentResponse(userMessage, sessionId) {
  try {
    console.log(`Received message from session ${sessionId}: ${userMessage}`);
    
    // Get or create conversation session for this sessionId
    let conversation = conversationSessions.get(sessionId);
    
    if (!conversation) {
      // Create new conversation session with text-only mode
      conversation = await createConversationSession(sessionId);
      conversationSessions.set(sessionId, conversation);
    }
    
    // Send user message and wait for agent response
    const agentResponse = await sendMessageAndWaitForResponse(conversation, userMessage);
    
    return agentResponse;
    
  } catch (error) {
    console.error('Error getting agent response:', error);
    return "Sorry, I encountered an error. Please try again.";
  }
}

async function createConversationSession(sessionId) {
  console.log(`Creating new conversation session for ${sessionId}`);
  
  // Create conversation with text-only override
  // const conversation = await elevenlabs.conversationalAi.conversations.create({
  //   agentId: AGENT_ID,
  //   overrides: {
  //     conversation: {
  //       textOnly: true,
  //     },
  //   },
  // });

  const conversation = await Conversation.startSession({
    agentId: AGENT_ID,
    overrides: {
      conversation: {
        textOnly: true,
      },
    },
  });
  
  return conversation;
}

async function sendMessageAndWaitForResponse(conversation, userMessage) {
  return new Promise((resolve, reject) => {
    let responseReceived = false;
    const timeout = setTimeout(() => {
      if (!responseReceived) {
        reject(new Error('Response timeout'));
      }
    }, 10000); // 10 second timeout
    
    // Set up event listener for agent response
    conversation.on('agent_response', (message) => {
      if (!responseReceived) {
        responseReceived = true;
        clearTimeout(timeout);
        console.log('Agent response received:', message.text);
        resolve(message.text);
      }
    });
    
    // Set up error handler
    conversation.on('error', (error) => {
      if (!responseReceived) {
        responseReceived = true;
        clearTimeout(timeout);
        console.error('Conversation error:', error);
        reject(error);
      }
    });
    
    // Send the user message
    conversation.sendUserMessage({
      text: userMessage,
    });
  });
}

// Optional: Clean up conversation sessions
export function cleanupConversationSession(sessionId) {
  const conversation = conversationSessions.get(sessionId);
  if (conversation) {
    conversation.disconnect();
    conversationSessions.delete(sessionId);
    console.log(`Cleaned up conversation session ${sessionId}`);
  }
}

// Optional: Clean up all sessions
export function cleanupAllSessions() {
  for (const [sessionId, conversation] of conversationSessions) {
    conversation.disconnect();
  }
  conversationSessions.clear();
  console.log('Cleaned up all conversation sessions');
}
