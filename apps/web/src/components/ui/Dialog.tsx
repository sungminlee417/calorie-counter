import React from "react";
import {
  Dialog as MuiDialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Box,
} from "@mui/material";

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
  return (
    <MuiDialog onClose={onClose} open={open} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box mt={1.5}>{children}</Box>
      </DialogContent>
      <DialogActions>{dialogActions}</DialogActions>
    </MuiDialog>
  );
};

export default Dialog;
