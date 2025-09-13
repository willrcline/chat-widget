import { Box, IconButton } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import ChatBox from "./ChatBox";
import { useChatContext } from "../contexts/ChatContext";

function ChatWidget() {
  const { isOpen, messages, handleSendMessage, toggleChat } = useChatContext();

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
