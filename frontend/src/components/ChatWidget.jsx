import { useState, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useConversation } from "@elevenlabs/react";
import ChatBox from "./ChatBox";
import { sendMessage, startConversationSession } from "../services/elevenLabsService";

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);

  // Use the working useConversation hook pattern from Test.jsx
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
      // Add agent message to chat
      const agentMsg = { role: "agent", message: message.message };
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

  useEffect(() => {
    loadSession();
    try {
        console.log("Starting conversation on component load...");
        startConversationSession(conversation);
      } catch (error) {
        console.error("Failed to start conversation:", error);
      }
  }, []);

  const handleSendMessage = async (userMessage) => {
    // Add user message to chat immediately
    const userMsg = { role: "user", message: userMessage };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    saveSession(updatedMessages);

    // Start conversation if not already connected
    if (conversation.status !== "connected") {
      try {
        console.log("Starting conversation before sending message...");
        await startConversationSession(conversation);
      } catch (error) {
        console.error("Failed to start conversation:", error);
        return;
      }
    }

    // Send message using the working pattern
    const success = sendMessage(conversation, userMessage);
    if (!success) {
      console.error("Failed to send message - conversation not ready");
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat Box */}
      {isOpen && (
        <ChatBox messages={messages} onSendMessage={handleSendMessage} />
      )}

      {/* Toggle Button */}
      <Box
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        {/* Black backdrop square */}
        <Box
          sx={{
            width: 60,
            height: 60,
            backgroundColor: "black",
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* White square with chevron */}
          <IconButton
            onClick={toggleChat}
            sx={{
              width: 50,
              height: 50,
              backgroundColor: "white",
              borderRadius: 1.5,
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            {isOpen ? (
              <ExpandMore sx={{ color: "black" }} />
            ) : (
              <ExpandLess sx={{ color: "black" }} />
            )}
          </IconButton>
        </Box>
      </Box>
    </>
  );
}

export default ChatWidget;
