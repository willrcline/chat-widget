import { useState, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import ChatBox from "./ChatBox";
import {
  sendUserMessage,
  setMessageCallback,
  createConversation,
  minimalSendUserMessage,
} from "../services/elevenLabsService";

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [conversation, setConversation] = useState(null)

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

    // Set up callback for agent messages
    setMessageCallback((agentResponse) => {
      const agentMsg = { role: "agent", message: agentResponse };
      setMessages((currentMessages) => {
        const updatedMessages = [...currentMessages, agentMsg];

        // Get current sessionId from sessionStorage to avoid stale closure
        const savedSession = sessionStorage.getItem("chatSession");
        if (savedSession) {
          const session = JSON.parse(savedSession);
          const updatedSession = {
            sessionId: session.sessionId,
            messages: updatedMessages,
          };
          sessionStorage.setItem("chatSession", JSON.stringify(updatedSession));
        }

        return updatedMessages;
      });
    });

    const asyncFunc = async () => {
      console.log("about to call createConversation")
      const convo = await createConversation("testSession");
      console.log("conversation obj after createconversation()", convo)
      setConversation(convo)
    }
    asyncFunc()
  }, []);


  const handleSendMessage = async (userMessage) => {
    // Ensure we have a sessionId
    // if (!sessionId) {
    //   console.error('No sessionId available');
    //   return;
    // }

    const userMsg = { role: "user", message: userMessage };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    saveSession(updatedMessages);


    // await navigator.mediaDevices.getUserMedia({ audio: true });


    // Send message to ElevenLabs (response will come via callback)
    // sendUserMessage(userMessage, sessionId);
    
    console.log("conversation__", conversation)

    try {
      // setTimeout(() => {
        minimalSendUserMessage(conversation, userMessage)
      // }, 5000);
    } catch (error) {
      console.log("error in sendUserMessage", error);
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
