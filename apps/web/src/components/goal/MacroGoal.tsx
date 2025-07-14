"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Typography, IconButton, Stack, Box } from "@mui/material";
import {
  Edit,
  LocalFireDepartment,
  Restaurant,
  EmojiNature,
  FitnessCenter,
} from "@mui/icons-material";
import { MacroGoal } from "@/types/supabase";
import Dialog from "../ui/Dialog";
import DialogFormActions from "../ui/DialogFormActions";
import useMacroGoal from "@/hooks/useMacroGoal";
import MacroGoalForm from "./MacroGoalForm";

const EMPTY_MACRO_GOAL: MacroGoal = {
  protein: 0,
  fat: 0,
  carbs: 0,
  created_at: "",
  id: 0,
  updated_at: null,
  user_id: "",
  calories: 0,
};

const MacroGoalPanel = () => {
  const {
    createMacroGoal,
    deleteMacroGoal,
    isLoading,
    macroGoal,
    updateMacroGoal,
  } = useMacroGoal();

  const [isMacroGoalDialogOpen, setIsMacroGoalDialogOpen] = useState(false);
  const [editedMacroGoal, setEditedMacroGoal] =
    useState<MacroGoal>(EMPTY_MACRO_GOAL);

  const handleSave = useCallback(() => {
    const macroGoalToSave = {
      protein: editedMacroGoal.protein,
      fat: editedMacroGoal.fat,
      carbs: editedMacroGoal.carbs,
      calories: editedMacroGoal.calories,
      user_id: editedMacroGoal.user_id,
    };
    if (editedMacroGoal.id) {
      updateMacroGoal(editedMacroGoal);
    } else {
      createMacroGoal(macroGoalToSave);
    }

    setIsMacroGoalDialogOpen(false);
  }, [createMacroGoal, editedMacroGoal, updateMacroGoal]);

  const handleDeleteMacroGoal = useCallback(
    (macroGoalId: string) => {
      deleteMacroGoal(macroGoalId);
      setEditedMacroGoal(EMPTY_MACRO_GOAL);
      setIsMacroGoalDialogOpen(false);
    },
    [deleteMacroGoal]
  );

  useEffect(() => {
    if (!isLoading && macroGoal) {
      setEditedMacroGoal(macroGoal);
    }
  }, [isLoading, macroGoal]);

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">🎯 Daily Macro Goals</Typography>
        <IconButton onClick={() => setIsMacroGoalDialogOpen(true)}>
          <Edit />
        </IconButton>
      </Stack>

      <Stack spacing={1.5}>
        <MacroItem
          icon={<LocalFireDepartment color="error" />}
          label="Calories"
          value={`${macroGoal?.calories ?? 0} kcal`}
        />
        <MacroItem
          icon={<FitnessCenter color="primary" />}
          label="Protein"
          value={`${macroGoal?.protein ?? 0}g`}
        />
        <MacroItem
          icon={<EmojiNature sx={{ color: "#43a047" }} />}
          label="Fat"
          value={`${macroGoal?.fat ?? 0}g`}
        />
        <MacroItem
          icon={<Restaurant sx={{ color: "#ff9800" }} />}
          label="Carbs"
          value={`${macroGoal?.carbs ?? 0}g`}
        />
      </Stack>

      <Dialog
        dialogActions={
          <DialogFormActions
            onCancel={() => setIsMacroGoalDialogOpen(false)}
            onDelete={
              editedMacroGoal.id
                ? () => handleDeleteMacroGoal(String(editedMacroGoal.id))
                : undefined
            }
            onSave={() => handleSave()}
          />
        }
        onClose={() => setIsMacroGoalDialogOpen(false)}
        open={isMacroGoalDialogOpen}
        title="Edit Macro Goals"
      >
        <MacroGoalForm
          macroGoal={editedMacroGoal}
          onChange={(updatedMacroGoal) => setEditedMacroGoal(updatedMacroGoal)}
        />
      </Dialog>
    </>
  );
};

function MacroItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box sx={{ width: 32, height: 32 }}>{icon}</Box>
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
