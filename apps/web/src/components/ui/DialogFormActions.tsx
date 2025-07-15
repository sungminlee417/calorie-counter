import { Button, Stack } from "@mui/material";
import React from "react";

export interface DialogFormActionsProps {
  onCancel: () => void;
  onDelete?: () => void;
  onSave?: () => void;
}

const DialogFormActions: React.FC<DialogFormActionsProps> = ({
  onCancel,
  onDelete,
  onSave,
}) => {
  return (
    <Stack
      alignItems="center"
      direction="row"
      justifyContent="space-between"
      padding={1}
      width="100%"
    >
      <Stack direction="row" spacing={1}>
        {onSave && (
          <Button onClick={onSave} color="primary" variant="contained">
            Save
          </Button>
        )}
        <Button onClick={onCancel} color="secondary">
          Cancel
        </Button>
      </Stack>
      {onDelete && (
        <Button onClick={onDelete} color="error">
          Delete
        </Button>
      )}
    </Stack>
  );
};

export default DialogFormActions;
