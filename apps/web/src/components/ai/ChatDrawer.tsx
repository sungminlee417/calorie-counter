import React, { useEffect, useRef } from "react";
import { Close as CloseIcon } from "@mui/icons-material";
import {
  Box,
  Drawer,
  IconButton,
  Paper,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { useChat } from "@ai-sdk/react";

export interface ChatDrawerProps {
  isDrawerOpen: boolean;
  onClose: () => void;
}

const ChatDrawer: React.FC<ChatDrawerProps> = ({ isDrawerOpen, onClose }) => {
  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: "/api/chat",
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <Drawer
      anchor="right"
      open={isDrawerOpen}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100%", sm: 400 },
            display: "flex",
            flexDirection: "column",
          },
        },
      }}
    >
      <Box
        p={2}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="h6">AI Assistant</Typography>
        <IconButton onClick={onClose} aria-label="close chat drawer">
          <CloseIcon />
        </IconButton>
      </Box>

      <Paper
        variant="outlined"
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          borderRadius: 2,
          m: 2,
          p: 2,
          bgcolor: "background.paper",
        }}
        ref={scrollRef}
      >
        {messages.length === 0 && (
          <Typography color="text.secondary" align="center">
            Start the conversation by typing a message below.
          </Typography>
        )}

        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              mb: 1.5,
              textAlign: message.role === "user" ? "right" : "left",
            }}
          >
            <Typography
              variant="body2"
              component="span"
              sx={{
                px: 2,
                py: 1,
                borderRadius: 2,
                bgcolor: message.role === "user" ? "primary.main" : "grey.300",
                color:
                  message.role === "user"
                    ? "primary.contrastText"
                    : "text.primary",
                display: "inline-block",
                maxWidth: "75%",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {message.content}
            </Typography>
          </Box>
        ))}
      </Paper>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 2,
          display: "flex",
          gap: 1,
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <TextField
          size="small"
          fullWidth
          placeholder="Type your message..."
          value={input}
          onChange={handleInputChange}
          disabled={status === "streaming"}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          multiline
          maxRows={4}
          aria-label="chat input"
        />
        <Button
          variant="contained"
          type="submit"
          disabled={status === "streaming" || input.trim().length === 0}
          aria-label="send message"
        >
          Send
        </Button>
      </Box>
    </Drawer>
  );
};

export default ChatDrawer;
