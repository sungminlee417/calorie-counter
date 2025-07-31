import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Close as CloseIcon,
  SmartToy,
  Send,
  AttachFile,
  Stop,
} from "@mui/icons-material";
import {
  Box,
  Drawer,
  IconButton,
  Paper,
  TextField,
  Typography,
  Button,
  useTheme,
  Stack,
  Fade,
  InputAdornment,
  Chip,
} from "@mui/material";
import { useChat } from "@ai-sdk/react";
import { useQueryClient } from "@tanstack/react-query";
import { userFriendlyToolNames } from "@/lib/ai/tools/utils";
import { API_ENDPOINTS, MACRO_CHART_COLORS, UI_COLORS } from "@/constants/app";

export interface ChatDrawerProps {
  isDrawerOpen: boolean;
  onClose: () => void;
}

const ChatDrawer: React.FC<ChatDrawerProps> = ({ isDrawerOpen, onClose }) => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const toolsCalledRef = useRef(new Set<string>());

  const addToolCall = (toolName: string) => {
    toolsCalledRef.current.add(toolName);
  };

  const clearToolCalls = () => {
    toolsCalledRef.current.clear();
  };

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    status,
    stop,
  } = useChat({
    api: API_ENDPOINTS.chat,
    experimental_throttle: 50,
    onToolCall: ({ toolCall: { toolName } }) => {
      if (toolName === "createFood" || toolName === "createFoodEntry") {
        addToolCall(toolName);
      }
    },
    onFinish: () => {
      toolsCalledRef.current.forEach((toolName) => {
        if (toolName === "createFood") {
          queryClient.invalidateQueries({ queryKey: ["foods"] });
        }
        if (toolName === "createFoodEntry") {
          queryClient.invalidateQueries({ queryKey: ["food-entries"] });
        }
      });
      clearToolCalls();
    },
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

  const onSubmit = useCallback(
    (e: React.FormEvent | React.KeyboardEvent) => {
      handleSubmit(e, { experimental_attachments: files });
      setFiles(undefined);
    },
    [files, handleSubmit]
  );

  const lastToolPart = React.useMemo(() => {
    return [...messages]
      .flatMap(
        (msg) =>
          msg.parts?.map((part) => ({
            id: msg.id,
            role: msg.role,
            part,
          })) ?? []
      )
      .reverse()
      .find((p) => p.part.type === "tool-invocation");
  }, [messages]);

  return (
    <Drawer
      anchor="right"
      open={isDrawerOpen}
      onClose={handleClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100%", sm: 420 },
            display: "flex",
            flexDirection: "column",
            background:
              theme.palette.mode === "dark"
                ? UI_COLORS.gradients.neutral.dark
                : UI_COLORS.gradients.neutral.light,
            borderLeft: `1px solid ${theme.palette.divider}`,
          },
        },
      }}
    >
      {/* Header */}
      <Paper
        elevation={2}
        sx={{
          borderRadius: 0,
          p: 3,
          borderBottom: `1px solid ${theme.palette.divider}`,
          background: `linear-gradient(90deg, ${MACRO_CHART_COLORS.protein}15, ${MACRO_CHART_COLORS.carbs}15)`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <SmartToy sx={{ color: MACRO_CHART_COLORS.protein, fontSize: 28 }} />
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{
              flex: 1,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            AI Assistant
          </Typography>
          <Chip
            size="small"
            label="Beta"
            sx={{
              height: 20,
              fontSize: "0.7rem",
              fontWeight: "600",
              backgroundColor: `${MACRO_CHART_COLORS.protein}25`,
              color: MACRO_CHART_COLORS.protein,
            }}
          />
          <IconButton
            onClick={handleClose}
            aria-label="close chat drawer"
            sx={{
              backgroundColor: `${theme.palette.action.hover}`,
              "&:hover": {
                backgroundColor: `${theme.palette.error.light}15`,
                color: theme.palette.error.main,
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </Paper>

      {/* Messages Area */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          px: 2,
          py: 2,
          bgcolor: "transparent",
        }}
        ref={scrollRef}
      >
        {messages.length === 0 && (
          <Fade in timeout={500}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                mt: 4,
                textAlign: "center",
                borderRadius: 3,
                background: `${MACRO_CHART_COLORS.protein}08`,
                border: `1px dashed ${MACRO_CHART_COLORS.protein}44`,
              }}
            >
              <Stack alignItems="center" spacing={2}>
                <Box sx={{ color: MACRO_CHART_COLORS.protein, fontSize: 48 }}>
                  <SmartToy />
                </Box>
                <Typography variant="h6" color="text.secondary">
                  Welcome to AI Assistant!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  I can help you track food, analyze nutrition, and answer
                  questions about your calorie goals.
                </Typography>
              </Stack>
            </Paper>
          </Fade>
        )}

        {messages.map((message, idx) => {
          const isUser = message.role === "user";

          return (
            <Fade in timeout={300 + idx * 100} key={message.id}>
              <Box
                display="flex"
                justifyContent={isUser ? "flex-end" : "flex-start"}
                mb={2}
              >
                <Paper
                  elevation={1}
                  sx={{
                    px: 2.5,
                    py: 1.5,
                    borderRadius: 3,
                    bgcolor: isUser
                      ? `linear-gradient(135deg, ${MACRO_CHART_COLORS.protein}15, ${MACRO_CHART_COLORS.carbs}15)`
                      : theme.palette.mode === "dark"
                        ? "#2a2a2a"
                        : "#ffffff",
                    color: "text.primary",
                    maxWidth: "80%",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    border: isUser
                      ? `1px solid ${MACRO_CHART_COLORS.protein}22`
                      : `1px solid ${theme.palette.divider}`,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-1px)",
                      boxShadow: UI_COLORS.shadows.medium,
                    },
                  }}
                >
                  {message.content ? (
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      {message.content}
                    </Typography>
                  ) : (
                    message.parts?.map((part, idx) => {
                      if (part.type === "tool-invocation") {
                        if (
                          lastToolPart &&
                          lastToolPart.id === message.id &&
                          part === lastToolPart.part
                        ) {
                          return (
                            <Chip
                              key={idx}
                              size="small"
                              icon={<SmartToy />}
                              label={
                                userFriendlyToolNames[
                                  part.toolInvocation.toolName
                                ] ?? "Unknown Tool Call"
                              }
                              sx={{
                                height: 24,
                                fontSize: "0.75rem",
                                fontStyle: "italic",
                                backgroundColor: `${MACRO_CHART_COLORS.carbs}15`,
                                color: MACRO_CHART_COLORS.carbs,
                              }}
                            />
                          );
                        }
                        return null;
                      }

                      if (part.type === "text") {
                        return (
                          <Typography
                            key={idx}
                            variant="body2"
                            sx={{ lineHeight: 1.6 }}
                          >
                            {part.text}
                          </Typography>
                        );
                      }

                      return null;
                    })
                  )}
                </Paper>
              </Box>
            </Fade>
          );
        })}
      </Box>

      {/* Input Area */}
      <Paper
        component="form"
        onSubmit={onSubmit}
        elevation={2}
        sx={{
          p: 2.5,
          borderRadius: 0,
          borderTop: `1px solid ${theme.palette.divider}`,
          background: theme.palette.mode === "dark" ? "#1a1a1a" : "#ffffff",
        }}
      >
        <TextField
          size="small"
          fullWidth
          placeholder="Ask me about nutrition, food tracking, or your goals..."
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
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SmartToy sx={{ color: MACRO_CHART_COLORS.protein }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(255,255,255,0.8)",
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: MACRO_CHART_COLORS.protein,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: MACRO_CHART_COLORS.protein,
              },
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: MACRO_CHART_COLORS.protein,
            },
          }}
        />

        <Stack direction="row" alignItems="center" spacing={1} mt={1.5}>
          <Button
            variant="outlined"
            component="label"
            disabled={disabled}
            startIcon={<AttachFile />}
            sx={{
              minWidth: 0,
              borderRadius: 2,
              borderColor: theme.palette.divider,
              "&:hover": {
                borderColor: MACRO_CHART_COLORS.carbs,
                backgroundColor: `${MACRO_CHART_COLORS.carbs}08`,
              },
            }}
          >
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
            <Chip
              size="small"
              label={files[0].name}
              onDelete={() => setFiles(undefined)}
              sx={{
                maxWidth: 150,
                backgroundColor: `${MACRO_CHART_COLORS.carbs}15`,
                color: MACRO_CHART_COLORS.carbs,
              }}
            />
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
            startIcon={disabled ? <Stop /> : <Send />}
            aria-label={disabled ? "stop message" : "send message"}
            sx={{
              borderRadius: 2,
              background: disabled
                ? `linear-gradient(45deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`
                : `linear-gradient(45deg, ${MACRO_CHART_COLORS.protein}, ${MACRO_CHART_COLORS.carbs})`,
              "&:hover": {
                background: disabled
                  ? `linear-gradient(45deg, ${theme.palette.error.dark}, ${theme.palette.error.main})`
                  : `linear-gradient(45deg, ${MACRO_CHART_COLORS.carbs}, ${MACRO_CHART_COLORS.protein})`,
                transform: "scale(1.02)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            {disabled ? "Stop" : "Send"}
          </Button>
        </Stack>
      </Paper>
    </Drawer>
  );
};

export default ChatDrawer;
