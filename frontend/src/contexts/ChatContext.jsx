import { createContext, useContext, useState, useEffect } from "react";
import { useConversation } from "@elevenlabs/react";
import { sendMessage, startConversationSession } from "../services/elevenLabsService";

const ChatContext = createContext();

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);

  const conversation = useConversation({
    textOnly: true,
    onConnect: () => {
      console.log("ChatWidget: Connected to ElevenLabs");
    },
    onDisconnect: () => {
      console.log("ChatWidget: Disconnected from ElevenLabs");
    },
    onMessage: (message) => {
      console.log("ChatWidget: Received message:", message);
      const agentMsg = { 
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        role: "agent", 
        message: message.message,
        timestamp: Date.now()
      };
      setMessages((currentMessages) => {
        const updatedMessages = [...currentMessages, agentMsg];
        saveSession(updatedMessages);
        return updatedMessages;
      });
    },
    onError: (error) => {
      console.error("ChatWidget: ElevenLabs error:", error);
    },
  });

  const generateSessionId = () => {
    return (
      "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
    );
  };

  const loadSession = () => {
    const savedSession = sessionStorage.getItem("chatSession");
    if (savedSession) {
      const session = JSON.parse(savedSession);
      setSessionId(session.sessionId);
      setMessages(session.messages || []);
    } else {
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);
      const newSession = {
        sessionId: newSessionId,
        messages: [],
      };
      sessionStorage.setItem("chatSession", JSON.stringify(newSession));
    }
  };

  const saveSession = (updatedMessages) => {
    const session = {
      sessionId,
      messages: updatedMessages,
    };
    sessionStorage.setItem("chatSession", JSON.stringify(session));
  };

  const handleSendMessage = async (userMessage) => {
    const userMsg = { 
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role: "user", 
      message: userMessage,
      timestamp: Date.now()
    };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    saveSession(updatedMessages);

    if (conversation.status !== "connected") {
      try {
        console.log("Starting conversation before sending message...");
        await startConversationSession(conversation);
      } catch (error) {
        console.error("Failed to start conversation:", error);
        return;
      }
    }

    const success = sendMessage(conversation, userMessage);
    if (!success) {
      console.error("Failed to send message - conversation not ready");
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    loadSession();
    try {
        console.log("Starting conversation on component load...");
        startConversationSession(conversation);
      } catch (error) {
        console.error("Failed to start conversation:", error);
      }
  }, []);

  const value = {
    isOpen,
    messages,
    sessionId,
    conversation,
    handleSendMessage,
    toggleChat,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
