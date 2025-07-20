import React, { ReactNode } from "react";
import { Alert, AlertProps, Snackbar } from "@mui/material";

export interface ToastProps {
  children: ReactNode;
  handleCloseToast: () => void;
  toastOpen: boolean;
  toastSeverity: AlertProps["severity"];
}

const Toast: React.FC<ToastProps> = ({
  children,
  handleCloseToast,
  toastOpen,
  toastSeverity,
}) => {
  return (
    <Snackbar
      open={toastOpen}
      autoHideDuration={4000}
      onClose={handleCloseToast}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={handleCloseToast}
        severity={toastSeverity}
        sx={{ width: "100%" }}
        elevation={6}
        variant="filled"
      >
        {children}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
