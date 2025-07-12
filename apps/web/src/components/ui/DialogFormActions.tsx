import { Button } from "@mui/material";
import React from "react";

export interface DialogFormActionsProps {
  onCancel?: () => void;
  onSave?: () => void;
}

const DialogFormActions: React.FC<DialogFormActionsProps> = ({
  onCancel,
  onSave,
}) => {
  return (
    <>
      <Button onClick={onSave} color="primary">
        Save
      </Button>
      <Button onClick={onCancel} color="secondary">
        Cancel
      </Button>
    </>
  );
};

export default DialogFormActions;
