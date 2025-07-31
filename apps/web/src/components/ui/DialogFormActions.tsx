import { Button, Stack } from "@mui/material";
import React from "react";

export interface DialogFormActionsProps {
  onCancel: () => void;
  onDelete?: () => void;
  onSave?: () => void;
  onSaveDisabled?: boolean;
}

const DialogFormActions: React.FC<DialogFormActionsProps> = ({
  onCancel,
  onDelete,
  onSave,
  onSaveDisabled = false,
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
          <Button
            disabled={onSaveDisabled}
            onClick={onSave}
            color="primary"
            variant="contained"
            sx={{
              opacity: onSaveDisabled ? 0.6 : 1,
              transition: "opacity 0.2s ease-in-out",
            }}
          >
            {onSaveDisabled ? "No Changes" : "Save"}
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
