import React from "react";
import {
  Dialog as MuiDialog,
  DialogActions,
  DialogTitle,
  DialogContent,
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
      <DialogContent>{children}</DialogContent>
      <DialogActions>{dialogActions}</DialogActions>
    </MuiDialog>
  );
};

export default Dialog;
