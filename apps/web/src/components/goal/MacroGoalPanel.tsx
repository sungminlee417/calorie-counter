"use client";

import React, { useCallback, useEffect, useState } from "react";
import useFormChangeDetection from "@/hooks/useFormChangeDetection";
import {
  Typography,
  IconButton,
  Stack,
  Box,
  Skeleton,
  Paper,
  Tooltip,
  useTheme,
  Chip,
  Fade,
} from "@mui/material";
import {
  Edit,
  LocalFireDepartment,
  Restaurant,
  EmojiNature,
  FitnessCenter,
  MyLocation,
} from "@mui/icons-material";

import useMacroGoal from "@/hooks/useMacroGoal";
import { MacroGoal } from "@/types/supabase";
import { macroGoalSchema } from "@/types/goal";

import Dialog from "../ui/Dialog";
import DialogFormActions from "../ui/DialogFormActions";
import MacroGoalForm from "./MacroGoalForm";
import Toast from "../ui/Toast";
import useToast from "@/hooks/useToast";
import { MACRO_CHART_COLORS, UI_COLORS } from "@/constants/app";

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
  const theme = useTheme();
  const {
    createMacroGoal,
    deleteMacroGoal,
    isLoading,
    macroGoal,
    updateMacroGoal,
  } = useMacroGoal();

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<MacroGoal>(EMPTY_MACRO_GOAL);
  const [editedGoal, setEditedGoal] = useState<MacroGoal>(EMPTY_MACRO_GOAL);

  const {
    handleCloseToast,
    showToast,
    toastMessage,
    toastOpen,
    toastSeverity,
  } = useToast();

  // Use change detection for the form
  const { hasChanges: formHasChanges } = useFormChangeDetection(
    selectedGoal,
    editedGoal,
    {
      ignoreKeys: ["id", "created_at", "updated_at", "user_id"],
      enableLogging: process.env.NODE_ENV === "development",
    }
  );

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
      setSelectedGoal(macroGoal);
      setEditedGoal(macroGoal);
    }
  }, [isLoading, macroGoal]);

  return (
    <React.Fragment>
      <Paper
        elevation={2}
        sx={{
          borderRadius: 3,
          background:
            theme.palette.mode === "dark"
              ? UI_COLORS.gradients.neutral.dark
              : UI_COLORS.gradients.neutral.light,
          border: `1px solid ${theme.palette.divider}`,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 3,
            borderBottom: `1px solid ${theme.palette.divider}`,
            background: `linear-gradient(90deg, ${MACRO_CHART_COLORS.calories}15, ${MACRO_CHART_COLORS.protein}15, ${MACRO_CHART_COLORS.fat}15, ${MACRO_CHART_COLORS.carbs}15)`,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <MyLocation
              sx={{ color: MACRO_CHART_COLORS.protein, fontSize: 28 }}
            />
            <Typography
              variant="h5"
              fontWeight="600"
              sx={{
                flex: 1,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Daily Macro Goals
            </Typography>
            <Tooltip title="Edit macro goals" arrow>
              <IconButton
                onClick={() => setDialogOpen(true)}
                sx={{
                  backgroundColor: `${theme.palette.primary.main}15`,
                  color: theme.palette.primary.main,
                  borderRadius: "50%", // Fully circular
                  width: 40,
                  height: 40,
                  "&:hover": {
                    backgroundColor: `${theme.palette.primary.main}25`,
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <Edit />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        {/* Content */}
        <Box sx={{ p: 3 }}>
          {isLoading ? (
            <Stack spacing={2}>
              {[...Array(4)].map((_, idx) => (
                <Fade in timeout={300 + idx * 100} key={idx}>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background:
                        theme.palette.mode === "dark" ? "#2a2a2a" : "#ffffff",
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Skeleton variant="circular" width={32} height={32} />
                      <Box flex={1}>
                        <Skeleton width="60%" height={20} />
                        <Skeleton width="40%" height={16} sx={{ mt: 0.5 }} />
                      </Box>
                      <Skeleton width={60} height={20} />
                    </Stack>
                  </Paper>
                </Fade>
              ))}
            </Stack>
          ) : !macroGoal ? (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 2,
                background: `${MACRO_CHART_COLORS.protein}08`,
                border: `1px dashed ${MACRO_CHART_COLORS.protein}44`,
              }}
            >
              <Stack alignItems="center" spacing={2}>
                <Box sx={{ color: MACRO_CHART_COLORS.protein, fontSize: 48 }}>
                  <MyLocation />
                </Box>
                <Typography variant="h6" color="text.secondary">
                  No macro goals set
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Set your daily macro targets to track your nutrition goals!
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <IconButton
                    onClick={() => setDialogOpen(true)}
                    sx={{
                      backgroundColor: `${MACRO_CHART_COLORS.protein}15`,
                      color: MACRO_CHART_COLORS.protein,
                      "&:hover": {
                        backgroundColor: `${MACRO_CHART_COLORS.protein}25`,
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    <Edit />
                  </IconButton>
                </Box>
              </Stack>
            </Paper>
          ) : (
            <Stack spacing={2}>
              {/* Calories */}
              <MacroGoalItem
                icon={
                  <LocalFireDepartment
                    sx={{ color: MACRO_CHART_COLORS.calories }}
                  />
                }
                label="Calories"
                value={`${macroGoal.calories} kcal`}
                color={MACRO_CHART_COLORS.calories}
                description="Total daily energy target"
              />

              {/* Carbs */}
              <MacroGoalItem
                icon={<Restaurant sx={{ color: MACRO_CHART_COLORS.carbs }} />}
                label="Carbs"
                value={`${macroGoal.carbs}g`}
                color={MACRO_CHART_COLORS.carbs}
                description="Primary energy source"
              />

              {/* Fat */}
              <MacroGoalItem
                icon={<EmojiNature sx={{ color: MACRO_CHART_COLORS.fat }} />}
                label="Fat"
                value={`${macroGoal.fat}g`}
                color={MACRO_CHART_COLORS.fat}
                description="Healthy fats for hormones"
              />

              {/* Protein */}
              <MacroGoalItem
                icon={
                  <FitnessCenter sx={{ color: MACRO_CHART_COLORS.protein }} />
                }
                label="Protein"
                value={`${macroGoal.protein}g`}
                color={MACRO_CHART_COLORS.protein}
                description="Essential for muscle building"
              />
            </Stack>
          )}
        </Box>
      </Paper>

      <Dialog
        open={isDialogOpen}
        onClose={() => {
          if (!isLoading) setDialogOpen(false);
        }}
        title={`Edit Macro Goals${formHasChanges ? " •" : ""}`}
        dialogActions={
          <DialogFormActions
            onCancel={() => setDialogOpen(false)}
            onDelete={
              editedGoal.id
                ? () => handleDelete(String(editedGoal.id))
                : undefined
            }
            onSave={handleSave}
            onSaveDisabled={!formHasChanges}
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
    </React.Fragment>
  );
};

function MacroGoalItem({
  icon,
  label,
  value,
  color,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  description: string;
}) {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 2.5,
        borderRadius: 2,
        background: `linear-gradient(135deg, ${color}08, ${color}15)`,
        border: `1px solid ${color}22`,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: `0 4px 12px ${color}25`,
          border: `1px solid ${color}44`,
        },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        {/* Icon */}
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            background: `${color}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>

        {/* Content */}
        <Box flex={1}>
          <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
            <Typography variant="h6" fontWeight="600">
              {label}
            </Typography>
            <Chip
              size="small"
              label={value}
              sx={{
                height: 20,
                fontSize: "0.75rem",
                fontWeight: "600",
                backgroundColor: `${color}25`,
                color: color,
              }}
            />
          </Stack>
          <Typography variant="caption" color="text.secondary">
            {description}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

export default MacroGoalPanel;
