import React from "react";
import {
  Dialog as MuiDialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Box,
  useTheme,
} from "@mui/material";
import { UI_COLORS } from "@/constants/app";

export interface DialogProps {
  children?: React.ReactNode;
  dialogActions?: React.ReactNode;
  onClose: () => void;
  open: boolean;
  title: string;
}

const Dialog: React.FC<DialogProps> = ({
  children,
  dialogActions,
  onClose,
  open,
  title,
}) => {
  const theme = useTheme();

  return (
    <MuiDialog
      onClose={onClose}
      open={open}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background:
            theme.palette.mode === "dark"
              ? UI_COLORS.gradients.neutral.dark
              : UI_COLORS.gradients.neutral.light,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: UI_COLORS.shadows.strong,
        },
      }}
    >
      <DialogTitle
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          background: `linear-gradient(90deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
          fontWeight: 600,
          fontSize: "1.25rem",
          backgroundImage: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Box mt={1}>{children}</Box>
      </DialogContent>
      <DialogActions
        sx={{
          p: 3,
          pt: 0,
          borderTop: `1px solid ${theme.palette.divider}`,
          background:
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.02)"
              : "rgba(0, 0, 0, 0.02)",
        }}
      >
        {dialogActions}
      </DialogActions>
    </MuiDialog>
  );
};

export default Dialog;
