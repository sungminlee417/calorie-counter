"use client";

import React from "react";
import { Fab, Tooltip } from "@mui/material";
import { Chat as ChatIcon } from "@mui/icons-material";

export interface ChatFabProps {
  hideButton?: boolean;
  onClick: () => void;
}

const ChatFab: React.FC<ChatFabProps> = ({ hideButton, onClick }) => {
  return (
    <>
      {!hideButton && (
        <Tooltip title="Ask AI" placement="left">
          <Fab
            onClick={onClick}
            sx={{
              position: "fixed",
              bottom: 24,
              right: 24,
              zIndex: 9999,
            }}
          >
            <ChatIcon />
          </Fab>
        </Tooltip>
      )}
    </>
  );
};

export default ChatFab;
