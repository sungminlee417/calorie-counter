"use client";

import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  LinearProgress,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import useFoodEntries from "@/hooks/useFoodEntries";
import useMacroGoal from "@/hooks/useMacroGoal";

const MacrosChart = () => {
  const { macroGoal } = useMacroGoal();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { foodEntries } = useFoodEntries(selectedDate);

  const macros = useMemo(() => {
    return foodEntries?.reduce(
      (acc, entry) => {
        acc.calories += (entry.foods.calories ?? 0) * entry.quantity;
        acc.carbs += (entry.foods.carbs ?? 0) * entry.quantity;
        acc.fats += (entry.foods.fat ?? 0) * entry.quantity;
        acc.protein += (entry.foods.protein ?? 0) * entry.quantity;
        return acc;
      },
      { calories: 0, carbs: 0, fats: 0, protein: 0 }
    );
  }, [foodEntries]);

  const total =
    (macros?.carbs ?? 0) + (macros?.fats ?? 0) + (macros?.protein ?? 0);

  const goalCalories =
    (macroGoal?.protein ?? 0) * 4 +
    (macroGoal?.carbs ?? 0) * 4 +
    (macroGoal?.fat ?? 0) * 9;

  const macroList = [
    {
      name: "Carbs",
      value: macros?.carbs ?? 0,
      goal: macroGoal?.carbs ?? null,
      unit: "g",
      color: "#8884d8",
    },
    {
      name: "Fats",
      value: macros?.fats ?? 0,
      goal: macroGoal?.fat ?? null,
      unit: "g",
      color: "#82ca9d",
    },
    {
      name: "Protein",
      value: macros?.protein ?? 0,
      goal: macroGoal?.protein ?? null,
      unit: "g",
      color: "#ffc658",
    },
  ];

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">
          {macroGoal
            ? `Calories: ${macros?.calories.toFixed(
                1
              )} / ${goalCalories.toFixed(1)} kcal`
            : `Calories: ${macros?.calories.toFixed(1)} kcal (estimated)`}
        </Typography>

        <TextField
          label="Date"
          type="date"
          size="small"
          value={dayjs(selectedDate).format("YYYY-MM-DD")}
          onChange={(e) => {
            const date = dayjs(e.target.value, "YYYY-MM-DD").toDate();
            setSelectedDate(date);
          }}
        />
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
            <Typography variant="body2">
              {macros?.calories.toFixed(1)} / {goalCalories.toFixed(1)} kcal
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={
              goalCalories ? (macros?.calories ?? 0 / goalCalories) * 100 : 0
            }
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: "#eee",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#f44336",
              },
            }}
          />
        </Box>
      )}

      {/* Macro Breakdown */}
      <Stack spacing={2}>
        {macroList.map((macro) => {
          const progress = macro.goal
            ? (macro.value / macro.goal) * 100
            : (macro.value / total) * 100;

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
                <Typography variant="body2">{label}</Typography>
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
