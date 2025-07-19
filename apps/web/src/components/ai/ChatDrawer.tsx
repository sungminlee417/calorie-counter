import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Close as CloseIcon } from "@mui/icons-material";
import {
  Box,
  Drawer,
  IconButton,
  Paper,
  TextField,
  Typography,
  Button,
  useTheme,
} from "@mui/material";
import { useChat } from "@ai-sdk/react";

export interface ChatDrawerProps {
  isDrawerOpen: boolean;
  onClose: () => void;
}

const ChatDrawer: React.FC<ChatDrawerProps> = ({ isDrawerOpen, onClose }) => {
  const theme = useTheme();
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    status,
  } = useChat({
    api: "/api/chat",
    experimental_throttle: 50,
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  const disabled = useMemo(() => {
    return status === "submitted" || status === "streaming";
  }, [status]);

  const handleClose = useCallback(() => {
    setMessages([]);
    onClose();
  }, [onClose, setMessages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const userColor =
    theme.palette.mode === "dark" ? "primary.dark" : "primary.main";
  const userText = theme.palette.getContrastText(theme.palette.primary.main);

  const assistantBg =
    theme.palette.mode === "dark"
      ? theme.palette.grey[800]
      : theme.palette.grey[200];

  return (
    <Drawer
      anchor="right"
      open={isDrawerOpen}
      onClose={handleClose}
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
        borderBottom={`1px solid ${theme.palette.divider}`}
      >
        <Typography variant="h6">💬 AI Assistant</Typography>
        <IconButton onClick={handleClose} aria-label="close chat drawer">
          <CloseIcon />
        </IconButton>
      </Box>

      <Paper
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          borderRadius: 0,
          m: 0,
          px: 2,
          py: 2,
          bgcolor: "background.default",
        }}
        ref={scrollRef}
      >
        {messages.length === 0 && (
          <Typography color="text.secondary" align="center" mt={4}>
            Start the conversation by typing a message below.
          </Typography>
        )}

        {messages.map((message) => {
          const isUser = message.role === "user";
          return (
            <Box
              key={message.id}
              display="flex"
              justifyContent={isUser ? "flex-end" : "flex-start"}
              mb={1.5}
            >
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 3,
                  bgcolor: isUser ? userColor : assistantBg,
                  color: isUser ? userText : "text.primary",
                  maxWidth: "75%",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  boxShadow: 1,
                }}
              >
                <Typography variant="body2">{message.content}</Typography>
              </Box>
            </Box>
          );
        })}
      </Paper>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 2,
          display: "flex",
          gap: 1,
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          bgcolor: "background.paper",
        }}
      >
        <TextField
          size="small"
          fullWidth
          placeholder="Type your message..."
          value={input}
          onChange={handleInputChange}
          disabled={disabled}
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
          disabled={disabled || input.trim().length === 0}
          aria-label="send message"
        >
          Send
        </Button>
      </Box>
    </Drawer>
  );
};

export default ChatDrawer;
