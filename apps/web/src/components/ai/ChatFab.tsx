"use client";

import React from "react";
import { Fab, Tooltip, useTheme, Fade } from "@mui/material";
import { SmartToy } from "@mui/icons-material";
import { MACRO_CHART_COLORS, UI_COLORS } from "@/constants/app";

export interface ChatFabProps {
  hideButton?: boolean;
  onClick: () => void;
}

const ChatFab: React.FC<ChatFabProps> = ({ hideButton, onClick }) => {
  const theme = useTheme();

  return (
    <Fade in={!hideButton} timeout={300}>
      <Tooltip
        title="Chat with AI Assistant"
        placement="left"
        arrow
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: theme.palette.mode === "dark" ? "#2a2a2a" : "#ffffff",
              color: "text.primary",
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              boxShadow: UI_COLORS.shadows.medium,
            },
          },
        }}
      >
        <Fab
          onClick={onClick}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 9999,
            width: 64,
            height: 64,
            background: `linear-gradient(135deg, ${MACRO_CHART_COLORS.protein}, ${MACRO_CHART_COLORS.carbs})`,
            color: "white",
            boxShadow: UI_COLORS.shadows.medium,
            "&:hover": {
              background: `linear-gradient(135deg, ${MACRO_CHART_COLORS.carbs}, ${MACRO_CHART_COLORS.protein})`,
              transform: "scale(1.1)",
              boxShadow: `0 8px 25px ${MACRO_CHART_COLORS.protein}40`,
            },
            "&:active": {
              transform: "scale(1.05)",
            },
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${MACRO_CHART_COLORS.protein}20, ${MACRO_CHART_COLORS.carbs}20)`,
              animation: "pulse 2s infinite",
            },
            "@keyframes pulse": {
              "0%": {
                transform: "scale(1)",
                opacity: 1,
              },
              "50%": {
                transform: "scale(1.2)",
                opacity: 0.7,
              },
              "100%": {
                transform: "scale(1)",
                opacity: 1,
              },
            },
          }}
        >
          <SmartToy sx={{ fontSize: 28 }} />
        </Fab>
      </Tooltip>
    </Fade>
  );
};

export default ChatFab;
