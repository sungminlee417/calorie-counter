"use client";

import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Stack,
  LinearProgress,
  Skeleton,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import useFoodEntries from "@/hooks/useFoodEntries";
import useMacroGoal from "@/hooks/useMacroGoal";
import { useDate } from "@/context/DateContext";
import { MACRO_CHART_COLORS, MACRO_CALORIES } from "@/constants/app";
import ArrowDatePicker from "../form/ArrowDatePicker";

const MacrosChart = () => {
  const { selectedDate, setSelectedDate } = useDate();
  const { isLoading, macroGoal } = useMacroGoal();
  const { foodEntries } = useFoodEntries(selectedDate);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const macros = useMemo(() => {
    return foodEntries?.reduce(
      (acc, entry) => {
        acc.calories += (entry.foods.calories ?? 0) * entry.quantity;
        acc.carbs += (entry.foods.carbs ?? 0) * entry.quantity;
        acc.fat += (entry.foods.fat ?? 0) * entry.quantity;
        acc.protein += (entry.foods.protein ?? 0) * entry.quantity;
        return acc;
      },
      { calories: 0, carbs: 0, fat: 0, protein: 0 }
    );
  }, [foodEntries]);

  const total =
    (macros?.carbs ?? 0) + (macros?.fat ?? 0) + (macros?.protein ?? 0);

  const goalCalories =
    (macroGoal?.protein ?? 0) * MACRO_CALORIES.protein +
    (macroGoal?.carbs ?? 0) * MACRO_CALORIES.carbs +
    (macroGoal?.fat ?? 0) * MACRO_CALORIES.fat;

  const macroList = [
    {
      name: "Carbs",
      value: macros?.carbs ?? 0,
      goal: macroGoal?.carbs ?? null,
      unit: "g",
      color: MACRO_CHART_COLORS.carbs,
    },
    {
      name: "Fat",
      value: macros?.fat ?? 0,
      goal: macroGoal?.fat ?? null,
      unit: "g",
      color: MACRO_CHART_COLORS.fat,
    },
    {
      name: "Protein",
      value: macros?.protein ?? 0,
      goal: macroGoal?.protein ?? null,
      unit: "g",
      color: MACRO_CHART_COLORS.protein,
    },
  ];

  if (isLoading) {
    return (
      <Box>
        <Skeleton variant="text" width={160} height={32} sx={{ mb: 2 }} />
        <Skeleton variant="text" width={200} height={20} sx={{ mb: 2 }} />
        <Box mb={3}>
          <Stack direction="row" justifyContent="space-between" mb={0.5}>
            <Skeleton variant="text" width={80} height={20} />
            <Skeleton variant="text" width={80} height={20} />
          </Stack>
          <Skeleton
            variant="rectangular"
            height={10}
            sx={{ borderRadius: 5 }}
          />
        </Box>

        <Stack spacing={2}>
          {[...Array(3)].map((_, i) => (
            <Box key={i}>
              <Stack direction="row" justifyContent="space-between" mb={0.5}>
                <Skeleton variant="text" width={80} height={20} />
                <Skeleton variant="text" width={60} height={20} />
              </Stack>
              <Skeleton
                variant="rectangular"
                height={10}
                sx={{ borderRadius: 5 }}
              />
            </Box>
          ))}
        </Stack>
      </Box>
    );
  }

  return (
    <Box>
      {/* Show DatePicker on top and centered for small screens */}
      {isSmallScreen && (
        <Box
          mb={3}
          display="flex"
          justifyContent="center"
          sx={{ width: "100%" }}
        >
          <ArrowDatePicker
            selectedDate={selectedDate}
            onChange={setSelectedDate}
          />
        </Box>
      )}

      <Stack
        direction={isSmallScreen ? "column" : "row"}
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        spacing={isSmallScreen ? 1 : 0}
      >
        {/* On larger screens, date picker can be inline here if desired */}
        {!isSmallScreen && (
          <ArrowDatePicker
            selectedDate={selectedDate}
            onChange={setSelectedDate}
          />
        )}

        <Typography variant="h6" sx={{ mt: isSmallScreen ? 2 : 0 }}>
          {macroGoal
            ? `Calories: ${(macros?.calories ?? 0).toFixed(
                1
              )} / ${goalCalories.toFixed(1)} kcal`
            : `Calories: ${macros?.calories.toFixed(1)} kcal (estimated)`}
        </Typography>
      </Stack>

      {!macroGoal && (
        <Typography
          variant="body2"
          color="text.secondary"
          mb={2}
          fontStyle="italic"
        >
          No macro goals set — showing % of today&apos;s intake
        </Typography>
      )}

      {/* Calories Progress Bar */}
      {macroGoal && (
        <Box mb={3}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2">Calories</Typography>
            <Typography
              variant="body2"
              sx={{
                color:
                  macros?.calories !== undefined &&
                  macros.calories > goalCalories
                    ? "error.main"
                    : "text.primary",
              }}
            >
              {macros?.calories.toFixed(1)} / {goalCalories.toFixed(1)} kcal
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={
              goalCalories
                ? Math.min(((macros?.calories ?? 0) / goalCalories) * 100, 100)
                : 0
            }
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: "#eee",
              "& .MuiLinearProgress-bar": {
                backgroundColor: MACRO_CHART_COLORS.calories,
              },
            }}
          />
        </Box>
      )}

      {/* Macro Breakdown */}
      <Stack spacing={2}>
        {macroList.map((macro) => {
          const progress = macro.goal
            ? Math.min((macro.value / macro.goal) * 100, 100)
            : (macro.value / (total || 1)) * 100;

          const label = macro.goal
            ? `${macro.value.toFixed(1)} / ${macro.goal.toFixed(1)}${
                macro.unit
              }`
            : `${macro.value.toFixed(1)}${macro.unit} (${progress.toFixed(
                0
              )}%)`;

          return (
            <Box key={macro.name}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2">{macro.name}</Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color:
                      macro.goal !== null && macro.value > macro.goal
                        ? "error.main"
                        : "text.primary",
                  }}
                >
                  {label}
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: "#eee",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: macro.color,
                  },
                }}
              />
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

export default MacrosChart;
