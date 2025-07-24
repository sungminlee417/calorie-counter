"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Typography,
  IconButton,
  Stack,
  Box,
  Skeleton,
  Paper,
  Tooltip,
} from "@mui/material";
import {
  Edit,
  LocalFireDepartment,
  Restaurant,
  EmojiNature,
  FitnessCenter,
} from "@mui/icons-material";

import useMacroGoal from "@/hooks/useMacroGoal";
import { MacroGoal } from "@/types/supabase";
import { macroGoalSchema } from "@/types/goal";

import Dialog from "../ui/Dialog";
import DialogFormActions from "../ui/DialogFormActions";
import MacroGoalForm from "./MacroGoalForm";
import Toast from "../ui/Toast";
import useToast from "@/hooks/useToast";

const EMPTY_MACRO_GOAL: MacroGoal = {
  id: 0,
  protein: 0,
  fat: 0,
  carbs: 0,
  calories: 0,
  user_id: "",
  created_at: "",
  updated_at: null,
};

const MacroGoalPanel = () => {
  const {
    createMacroGoal,
    deleteMacroGoal,
    isLoading,
    macroGoal,
    updateMacroGoal,
  } = useMacroGoal();

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editedGoal, setEditedGoal] = useState<MacroGoal>(EMPTY_MACRO_GOAL);

  const {
    handleCloseToast,
    showToast,
    toastMessage,
    toastOpen,
    toastSeverity,
  } = useToast();

  const handleSave = useCallback(async () => {
    const payload = {
      protein: editedGoal.protein,
      fat: editedGoal.fat,
      carbs: editedGoal.carbs,
      calories: editedGoal.calories,
      user_id: editedGoal.user_id,
    };

    const result = macroGoalSchema.safeParse(editedGoal);
    if (!result.success) {
      showToast("Invalid food entry data. Please check your input.", "error");
      return;
    }

    try {
      if (editedGoal.id) {
        await updateMacroGoal.mutateAsync(editedGoal);
        showToast("Macro goal updated successfully!", "success");
      } else {
        await createMacroGoal.mutateAsync(payload);
        showToast("Macro goal created successfully!", "success");
      }
    } catch {
      showToast("Failed to save macro goal.", "error");
    }

    setDialogOpen(false);
  }, [editedGoal, showToast, updateMacroGoal, createMacroGoal]);

  const handleDelete = useCallback(
    async (goalId: string) => {
      try {
        await deleteMacroGoal.mutateAsync(goalId);
        showToast("Macro goal deleted successfully!", "success");
        setEditedGoal(EMPTY_MACRO_GOAL);
        setDialogOpen(false);
      } catch {
        showToast("Food entry delete macro goal.", "error");
      }
    },
    [deleteMacroGoal, showToast]
  );

  useEffect(() => {
    if (!isLoading && macroGoal) {
      setEditedGoal(macroGoal);
    }
  }, [isLoading, macroGoal]);

  const renderMacroItem = (
    icon: React.ReactNode,
    label: string,
    value: string | null
  ) => (
    <MacroItem
      icon={icon}
      label={label}
      value={value ?? <Skeleton width={60} variant="text" />}
    />
  );

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: "background.paper",
      }}
    >
      <Stack direction="row" alignItems="center" mb={2}>
        <Typography variant="h6" flex={1}>
          🎯 Daily Macro Goals
        </Typography>
        <Tooltip title="Edit macro goals">
          <IconButton onClick={() => setDialogOpen(true)}>
            <Edit />
          </IconButton>
        </Tooltip>
      </Stack>

      <Stack spacing={1.5}>
        {renderMacroItem(
          <LocalFireDepartment color="error" />,
          "Calories",
          isLoading ? null : `${macroGoal?.calories ?? 0} kcal`
        )}
        {renderMacroItem(
          <FitnessCenter color="primary" />,
          "Protein",
          isLoading ? null : `${macroGoal?.protein ?? 0}g`
        )}
        {renderMacroItem(
          <EmojiNature sx={{ color: "#43a047" }} />,
          "Fat",
          isLoading ? null : `${macroGoal?.fat ?? 0}g`
        )}
        {renderMacroItem(
          <Restaurant sx={{ color: "#ff9800" }} />,
          "Carbs",
          isLoading ? null : `${macroGoal?.carbs ?? 0}g`
        )}
      </Stack>

      <Dialog
        open={isDialogOpen}
        onClose={() => {
          if (!isLoading) setDialogOpen(false);
        }}
        title="Edit Macro Goals"
        dialogActions={
          <DialogFormActions
            onCancel={() => setDialogOpen(false)}
            onDelete={
              editedGoal.id
                ? () => handleDelete(String(editedGoal.id))
                : undefined
            }
            onSave={handleSave}
          />
        }
      >
        <MacroGoalForm
          macroGoal={editedGoal}
          onChange={(updated) => setEditedGoal(updated)}
        />
      </Dialog>

      <Toast
        handleCloseToast={handleCloseToast}
        toastOpen={toastOpen}
        toastSeverity={toastSeverity}
      >
        {toastMessage}
      </Toast>
    </Paper>
  );
};

function MacroItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box
        sx={{ width: 32, height: 32, display: "flex", alignItems: "center" }}
      >
        {icon}
      </Box>
      <Typography variant="body1" sx={{ minWidth: 80 }}>
        {label}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {value}
      </Typography>
    </Stack>
  );
}

export default MacroGoalPanel;
