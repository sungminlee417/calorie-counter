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

const MacrosChart = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { foodEntries } = useFoodEntries(selectedDate);

  const macros = useMemo(() => {
    return foodEntries?.reduce(
      (acc, entry) => {
        acc.carbs += entry.foods.carbs || 0;
        acc.fats += entry.foods.fat || 0;
        acc.protein += entry.foods.protein || 0;
        return acc;
      },
      { carbs: 0, fats: 0, protein: 0 }
    );
  }, [foodEntries]);

  const total =
    (macros?.carbs ?? 0) + (macros?.fats ?? 0) + (macros?.protein ?? 0);

  const totalCalories = useMemo(() => {
    if (!macros) return 0;
    return macros.carbs * 4 + macros.protein * 4 + macros.fats * 9;
  }, [macros]);

  const macroList = [
    { name: "Carbs", value: macros?.carbs ?? 0, color: "#8884d8" },
    { name: "Fats", value: macros?.fats ?? 0, color: "#82ca9d" },
    { name: "Protein", value: macros?.protein ?? 0, color: "#ffc658" },
  ];

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Calories: {totalCalories} kcal</Typography>

        <TextField
          label="Date"
          type="date"
          size="small"
          value={dayjs(selectedDate).format("YYYY-MM-DD")}
          onChange={(e) => {
            const date = dayjs(e.target.value, "YYYY-MM-DD").toDate();
            setSelectedDate(date);
          }}
          InputLabelProps={{ shrink: true }}
        />
      </Stack>

      <Stack spacing={2}>
        {macroList.map((macro) => (
          <Box key={macro.name}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2">{macro.name}</Typography>
              <Typography variant="body2">
                {macro.value}g (
                {total ? ((macro.value / total) * 100).toFixed(0) : 0}%)
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={total ? (macro.value / total) * 100 : 0}
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
        ))}
      </Stack>
    </Box>
  );
};

export default MacrosChart;
