import { useState } from "react";
import { Box, Paper, TextField, Typography, Button } from "@mui/material";
import ChatMessage from "./ChatMessage";
import { inputStyle } from "../styles/ChatBox";

function ChatBox({ messages, onSendMessage }) {
  const [inputValue, setInputValue] = useState("");
  const [visibleCount, setVisibleCount] = useState(30);
  const visibleMessages = messages.slice(-visibleCount);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Paper
      elevation={8}
      sx={{
        position: "fixed",
        bottom: 80,
        right: 20,
        width: 350,
        height: 400,
        display: "flex",
        flexDirection: "column",
        borderRadius: 4,
        overflow: "hidden",
        boxShadow: 8,
      }}
    >
      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          p: 1,
          overflowY: "auto",
          backgroundColor: "black",
        }}
      >
        {messages.length === 0 ? (
          <Box sx={{ p: 2, textAlign: "center", color: "white" }}>
            <Typography variant="body2">Start a conversation...</Typography>
          </Box>
        ) : (
          <>
            {messages.length > visibleCount && (
              <Box sx={{ p: 1, textAlign: 'center' }}>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => setVisibleCount(60)}
                  sx={{ 
                    color: 'white', 
                    borderColor: 'white',
                    '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  Load More Messages
                </Button>
              </Box>
            )}
            {visibleMessages.map((msg) => (
              <ChatMessage key={msg.id} role={msg.role} message={msg.message} />
            ))}
          </>
        )}
      </Box>

      {/* Input Area */}
      <Box
        sx={{
          p: 1,
          borderTop: "1px solid black",
          backgroundColor: "black",
          display: "flex",
          alignItems: "center",
          gap: 1,
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          variant="outlined"
          sx={inputStyle}
        />
      </Box>
    </Paper>
  );
}

export default ChatBox;
