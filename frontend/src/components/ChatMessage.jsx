import { Box, Typography, Paper } from '@mui/material';

function ChatMessage({ role, message }) {
  const isUser = role === 'user';
  
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        mb: 1,
      }}
    >
      <Paper
        elevation={1}
        sx={{
          p: 1.5,
          maxWidth: "70%",
          backgroundColor: isUser ? "#e0e0e0" : "#343434",
          color: isUser ? "white" : "black",
          borderRadius: 2,
        }}
      >
        <Typography color={isUser ? "black" : "white"}>{message}</Typography>
      </Paper>
    </Box>
  );
}

export default ChatMessage;
