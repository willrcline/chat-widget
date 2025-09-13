import { Box, Typography, Paper, Link } from "@mui/material";
import { memo } from "react";

function ChatMessage({ role, message }) {
  const isUser = role === "user";

  // Function to parse markdown links and convert them to JSX
  const parseMarkdownLinks = (text) => {
    // Regex to match markdown links: [text](url)
    const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = markdownLinkRegex.exec(text)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      // Add the link
      const linkText = match[1];
      const linkUrl = match[2];
      parts.push(
        <Link
          key={match.index}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: isUser ? "#1976d2" : "#90caf9",
            textDecoration: "underline",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          {linkText}
        </Link>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text after the last link
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const parsedMessage = parseMarkdownLinks(message);

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
        <Typography color={isUser ? "black" : "white"}>
          {parsedMessage}
        </Typography>
      </Paper>
    </Box>
  );
}

export default memo(ChatMessage);
