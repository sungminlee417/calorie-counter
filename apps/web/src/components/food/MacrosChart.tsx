"use client";

import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Stack,
  useTheme,
  Paper,
  Fade,
  Zoom,
  CircularProgress,
} from "@mui/material";
import {
  LargeCard,
  MediumStack,
  SmallCard,
  CustomSkeleton,
} from "@/components/styled";
import {
  LocalFireDepartment,
  Restaurant,
  EmojiNature,
  FitnessCenter,
} from "@mui/icons-material";

import useFoodEntries from "@/hooks/useFoodEntries";
import useMacroGoal from "@/hooks/useMacroGoal";
import { useDate } from "@/context/DateContext";
import { MACRO_CHART_COLORS, MACRO_CALORIES } from "@/constants/app";
import ArrowDatePicker from "../form/ArrowDatePicker";

const CircularProgressWithLabel = ({
  value,
  current,
  goal,
  unit,
  color,
  icon,
  name,
  size = 120,
}: {
  value: number;
  current: number;
  goal: number | null;
  unit: string;
  color: string;
  icon: React.ReactNode;
  name: string;
  size?: number | { xs: number; lg: number };
}) => {
  const theme = useTheme();
  const isOverGoal = value > 100;
  const displayValue = Math.min(value, 100);

  // Handle responsive size - use theme breakpoints to get actual size
  const getActualSize = () => {
    if (typeof size === "object") {
      return size.lg; // Default to large size, we'll handle responsive via CSS
    }
    return size;
  };
  const actualSize = getActualSize();

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 2,
      }}
    >
      <Box
        sx={{
          position: "relative",
          mb: 1,
          // Responsive scaling using CSS transform
          transform:
            typeof size === "object"
              ? {
                  xs: `scale(${size.xs / size.lg})`,
                  lg: "scale(1)",
                }
              : "scale(1)",
          transformOrigin: "center",
        }}
      >
        {/* Background circle */}
        <CircularProgress
          variant="determinate"
          value={100}
          size={actualSize}
          thickness={4}
          sx={{
            color: theme.palette.mode === "dark" ? "#333" : "#f0f0f0",
            position: "absolute",
          }}
        />

        {/* Main progress circle */}
        <CircularProgress
          variant="determinate"
          value={displayValue}
          size={actualSize}
          thickness={4}
          sx={{
            color: isOverGoal ? "#d32f2f" : color, // Use distinct red color for overflow
            transform: "rotate(-90deg)!important",
            "& .MuiCircularProgress-circle": {
              strokeLinecap: "round",
            },
          }}
        />

        {/* Overflow indicator - inner pulsing circle with different color */}
        {isOverGoal && (
          <CircularProgress
            variant="determinate"
            value={100}
            size={actualSize - 12}
            thickness={3}
            sx={{
              color: "#ff9800", // Orange color to contrast with red
              position: "absolute",
              top: 6,
              left: 6,
              transform: "rotate(-90deg)!important",
              "& .MuiCircularProgress-circle": {
                strokeLinecap: "round",
                strokeDasharray: "8 4!important",
                animation: "pulse 1.5s ease-in-out infinite",
              },
              "@keyframes pulse": {
                "0%": {
                  opacity: 0.3,
                },
                "50%": {
                  opacity: 0.8,
                },
                "100%": {
                  opacity: 0.3,
                },
              },
            }}
          />
        )}

        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              color: isOverGoal ? "#d32f2f" : color, // Use distinct red color for overflow
              fontSize: 20,
              mb: 0.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
          <Typography
            variant="body2"
            fontWeight="600"
            textAlign="center"
            sx={{ color: isOverGoal ? "#d32f2f" : "inherit" }} // Use distinct red color for overflow
          >
            {current.toFixed(1)}
            <Typography
              component="span"
              variant="caption"
              color="text.secondary"
            >
              {unit}
            </Typography>
          </Typography>
          {goal && (
            <Typography
              variant="caption"
              color="text.secondary"
              textAlign="center"
            >
              /{goal.toFixed(0)}
              {unit}
            </Typography>
          )}
        </Box>
      </Box>
      <Typography
        variant="body2"
        fontWeight="500"
        color="text.primary"
        textAlign="center"
        sx={{
          color: isOverGoal ? "#d32f2f" : "text.primary", // Use distinct red color for overflow
        }}
      >
        {name}
      </Typography>
      {goal && (
        <Typography
          variant="caption"
          textAlign="center"
          sx={{
            color:
              value >= 95 && value <= 105
                ? "success.main"
                : value > 105
                  ? "error.main"
                  : "text.secondary",
            fontWeight: isOverGoal ? 600 : 400,
          }}
        >
          {value.toFixed(0)}%{isOverGoal && " ⚠️"}
        </Typography>
      )}
    </Box>
  );
};

const MacrosChart = () => {
  const { selectedDate, setSelectedDate } = useDate();
  const { isLoading, macroGoal } = useMacroGoal();
  const { foodEntries } = useFoodEntries(selectedDate);

  const theme = useTheme();

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
      icon: <Restaurant sx={{ color: MACRO_CHART_COLORS.carbs }} />,
      gradient: `linear-gradient(135deg, ${MACRO_CHART_COLORS.carbs}22, ${MACRO_CHART_COLORS.carbs}44)`,
    },
    {
      name: "Fat",
      value: macros?.fat ?? 0,
      goal: macroGoal?.fat ?? null,
      unit: "g",
      color: MACRO_CHART_COLORS.fat,
      icon: <EmojiNature sx={{ color: MACRO_CHART_COLORS.fat }} />,
      gradient: `linear-gradient(135deg, ${MACRO_CHART_COLORS.fat}22, ${MACRO_CHART_COLORS.fat}44)`,
    },
    {
      name: "Protein",
      value: macros?.protein ?? 0,
      goal: macroGoal?.protein ?? null,
      unit: "g",
      color: MACRO_CHART_COLORS.protein,
      icon: <FitnessCenter sx={{ color: MACRO_CHART_COLORS.protein }} />,
      gradient: `linear-gradient(135deg, ${MACRO_CHART_COLORS.protein}22, ${MACRO_CHART_COLORS.protein}44)`,
    },
  ];

  if (isLoading) {
    return (
      <LargeCard elevation={2}>
        {/* Header skeleton */}
        <MediumStack direction="row" alignItems="center" mb={3}>
          <CustomSkeleton variant="circular" width={32} height={32} />
          <CustomSkeleton variant="text" width={200} height={32} />
        </MediumStack>

        {/* Date picker skeleton */}
        <Box display="flex" justifyContent="center" mb={3}>
          <CustomSkeleton variant="rectangular" width={180} height={40} />
        </Box>

        {/* Calories progress skeleton */}
        <Box mb={3}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <CustomSkeleton variant="circular" width={20} height={20} />
              <CustomSkeleton variant="text" width={80} />
            </Stack>
            <CustomSkeleton variant="rectangular" width={60} height={24} />
          </Stack>
          <CustomSkeleton variant="rectangular" height={12} />
        </Box>

        {/* Macro skeletons */}
        <Stack spacing={3}>
          {[...Array(3)].map((_, i) => (
            <Fade in timeout={300 + i * 100} key={i}>
              <Paper
                elevation={1}
                sx={{
                  borderRadius: 2,
                  background:
                    theme.palette.mode === "dark" ? "#2a2a2a" : "#ffffff",
                  border: `1px solid ${theme.palette.divider}`,
                  p: 2,
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CustomSkeleton variant="circular" width={20} height={20} />
                    <CustomSkeleton variant="text" width={60} />
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CustomSkeleton variant="text" width={80} />
                    <CustomSkeleton variant="circular" width={16} height={16} />
                  </Stack>
                </Stack>
                <CustomSkeleton variant="rectangular" height={12} />
              </Paper>
            </Fade>
          ))}
        </Stack>
      </LargeCard>
    );
  }

  return (
    <LargeCard elevation={2}>
      {/* Header with icon */}
      <MediumStack direction="row" alignItems="center" mb={3}>
        <LocalFireDepartment
          sx={{
            color: MACRO_CHART_COLORS.calories,
            fontSize: 32,
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
          }}
        />
        <Typography
          variant="h5"
          fontWeight="600"
          sx={{
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Daily Nutrition
        </Typography>
      </MediumStack>

      {/* Date picker - centered for all screens */}
      <Box display="flex" justifyContent="center" mb={3}>
        <ArrowDatePicker
          selectedDate={selectedDate}
          onChange={setSelectedDate}
        />
      </Box>

      {/* Responsive Circular Progress Layout */}
      <Fade in timeout={300}>
        <SmallCard elevation={1}>
          <Box
            display="flex"
            flexDirection="column"
            gap={3}
            alignItems="center"
            justifyContent="center"
          >
            {/* All progress circles centered together */}
            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              gap={{ xs: 2, sm: 3 }}
              alignItems="center"
              justifyContent="center"
              flexWrap="wrap"
            >
              {/* Calories */}
              <Box display="flex" justifyContent="center">
                <CircularProgressWithLabel
                  value={
                    goalCalories
                      ? ((macros?.calories ?? 0) / goalCalories) * 100
                      : 0
                  }
                  current={macros?.calories ?? 0}
                  goal={goalCalories || null}
                  unit="kcal"
                  color={MACRO_CHART_COLORS.calories}
                  icon={<LocalFireDepartment />}
                  name="Calories"
                  size={{ xs: 130, lg: 130 }}
                />
              </Box>

              {/* Macros */}
              {macroList.map((macro, index) => {
                const progress = macro.goal
                  ? (macro.value / macro.goal) * 100
                  : 0;

                return (
                  <Zoom in timeout={400 + index * 100} key={macro.name}>
                    <Box display="flex" justifyContent="center">
                      <CircularProgressWithLabel
                        value={progress}
                        current={macro.value}
                        goal={macro.goal}
                        unit={macro.unit}
                        color={macro.color}
                        icon={macro.icon}
                        name={macro.name}
                        size={{ xs: 120, lg: 120 }}
                      />
                    </Box>
                  </Zoom>
                );
              })}
            </Box>
          </Box>

          {!macroGoal && (
            <Box mt={2} textAlign="center">
              <Typography
                variant="body2"
                color="text.secondary"
                fontStyle="italic"
              >
                Set macro goals to track progress
              </Typography>
            </Box>
          )}
        </SmallCard>
      </Fade>

      {/* Summary footer */}
      <Box mt={3} pt={2} borderTop={`1px solid ${theme.palette.divider}`}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body2" color="text.secondary">
            Total macros: {total.toFixed(1)}g
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Updated {new Date().toLocaleTimeString()}
          </Typography>
        </Stack>
      </Box>
    </LargeCard>
  );
};

export default MacrosChart;
