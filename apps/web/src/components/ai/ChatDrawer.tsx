import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { userFriendlyToolNames } from "@/lib/ai/tools/utils";

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
    stop,
  } = useChat({
    api: "/api/chat",
    experimental_throttle: 50,
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const [files, setFiles] = useState<FileList | undefined>(undefined);

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

  const onSubmit = useCallback(
    (e: React.FormEvent | React.KeyboardEvent) => {
      handleSubmit(e, { experimental_attachments: files });
      setFiles(undefined);
    },
    [files, handleSubmit]
  );

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
                {message.content ? (
                  <Typography variant="body2">{message.content}</Typography>
                ) : message.parts?.some(
                    (part) => part.type === "tool-invocation"
                  ) ? (
                  message.parts.map((part, idx) => {
                    if (part.type === "tool-invocation") {
                      return (
                        <Typography
                          key={idx}
                          variant="body2"
                          fontStyle="italic"
                          color="text.secondary"
                        >
                          {userFriendlyToolNames[
                            part.toolInvocation.toolName
                          ] ?? "Unknown Tool Call"}
                        </Typography>
                      );
                    }
                    return null;
                  })
                ) : (
                  message.parts?.map((part, idx) => {
                    if (part.type === "text") {
                      return (
                        <Typography key={idx} variant="body2">
                          {part.text}
                        </Typography>
                      );
                    }
                    return null;
                  })
                )}
              </Box>
            </Box>
          );
        })}
      </Paper>

      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
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
              onSubmit(e);
            }
          }}
          multiline
          maxRows={4}
          aria-label="chat input"
        />

        <Box display="flex" alignItems="center" gap={1}>
          <Button
            variant="outlined"
            component="label"
            disabled={disabled}
            sx={{ minWidth: 0 }}
          >
            📎
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                if (e.target.files) {
                  setFiles(e.target.files);
                }
              }}
            />
          </Button>

          {!!files?.length && (
            <Typography variant="body2" color="text.secondary">
              {files[0].name}
            </Typography>
          )}

          <Box flexGrow={1} />
          <Button
            variant="contained"
            onClick={disabled ? stop : undefined}
            type={disabled ? "button" : "submit"}
            disabled={
              disabled &&
              status !== "streaming" &&
              status !== "submitted" &&
              !input.trim()
            }
            aria-label={disabled ? "stop message" : "send message"}
          >
            {disabled ? "Stop" : "Send"}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ChatDrawer;
