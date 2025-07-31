"use client";

import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Stack,
  LinearProgress,
  Skeleton,
  useTheme,
  Paper,
  Chip,
  Tooltip,
  Fade,
  Zoom,
} from "@mui/material";
import {
  LocalFireDepartment,
  Restaurant,
  EmojiNature,
  FitnessCenter,
  TrendingUp,
  CheckCircle,
  Warning,
} from "@mui/icons-material";

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

  // Helper function to get status based on progress
  const getStatusInfo = (value: number, goal: number | null) => {
    if (!goal)
      return { status: "no-goal", icon: <TrendingUp />, color: "info" };

    const percentage = (value / goal) * 100;

    if (percentage >= 95 && percentage <= 105) {
      return { status: "perfect", icon: <CheckCircle />, color: "success" };
    } else if (percentage > 105) {
      return { status: "over", icon: <Warning />, color: "warning" };
    } else if (percentage >= 80) {
      return { status: "close", icon: <TrendingUp />, color: "info" };
    } else {
      return { status: "under", icon: <TrendingUp />, color: "grey" };
    }
  };

  // Enhanced progress bar component
  const EnhancedProgressBar = ({
    value,
    color,
    goal,
    current,
    name,
    unit,
  }: {
    value: number;
    color: string;
    goal: number | null;
    current: number;
    name: string;
    unit: string;
  }) => {
    const clampedValue = Math.min(Math.max(value || 0, 0), 100);

    return (
      <Tooltip
        title={
          goal
            ? `${name}: ${current.toFixed(1)}${unit} of ${goal.toFixed(1)}${unit} (${value.toFixed(1)}%)`
            : `${name}: ${current.toFixed(1)}${unit}`
        }
        placement="top"
        arrow
      >
        <Box
          sx={{
            position: "relative",
            cursor: "pointer",
            "&:hover": {
              transform: "translateY(-1px)",
              transition: "transform 0.2s ease-in-out",
            },
          }}
        >
          <LinearProgress
            variant="determinate"
            value={clampedValue}
            sx={{
              height: 12,
              borderRadius: 6,
              backgroundColor:
                theme.palette.mode === "dark" ? "#2a2a2a" : "#f0f0f0",
              "& .MuiLinearProgress-bar": {
                backgroundColor: color,
                borderRadius: 6,
              },
            }}
          />
          {value > 100 && (
            <Box
              sx={{
                position: "absolute",
                right: -2,
                top: "50%",
                transform: "translateY(-50%)",
                width: 6,
                height: 16,
                backgroundColor: "warning.main",
                borderRadius: 1,
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            />
          )}
        </Box>
      </Tooltip>
    );
  };

  if (isLoading) {
    return (
      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 3,
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)"
              : "linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)",
        }}
      >
        {/* Header skeleton */}
        <Stack direction="row" alignItems="center" mb={3} spacing={2}>
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="text" width={200} height={32} />
        </Stack>

        {/* Date picker skeleton */}
        <Box display="flex" justifyContent="center" mb={3}>
          <Skeleton
            variant="rectangular"
            width={180}
            height={40}
            sx={{ borderRadius: 2 }}
          />
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
              <Skeleton variant="circular" width={20} height={20} />
              <Skeleton variant="text" width={80} />
            </Stack>
            <Skeleton
              variant="rectangular"
              width={60}
              height={24}
              sx={{ borderRadius: 1 }}
            />
          </Stack>
          <Skeleton
            variant="rectangular"
            height={12}
            sx={{ borderRadius: 6 }}
          />
        </Box>

        {/* Macro skeletons */}
        <Stack spacing={3}>
          {[...Array(3)].map((_, i) => (
            <Fade in timeout={300 + i * 100} key={i}>
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
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Skeleton variant="circular" width={20} height={20} />
                    <Skeleton variant="text" width={60} />
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Skeleton variant="text" width={80} />
                    <Skeleton variant="circular" width={16} height={16} />
                  </Stack>
                </Stack>
                <Skeleton
                  variant="rectangular"
                  height={12}
                  sx={{ borderRadius: 6 }}
                />
              </Paper>
            </Fade>
          ))}
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 3,
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)"
            : "linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)",
        border: `1px solid ${theme.palette.divider}`,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${MACRO_CHART_COLORS.carbs}, ${MACRO_CHART_COLORS.fat}, ${MACRO_CHART_COLORS.protein})`,
        },
      }}
    >
      {/* Header with icon */}
      <Stack direction="row" alignItems="center" mb={3} spacing={2}>
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
      </Stack>

      {/* Date picker - centered for all screens */}
      <Box display="flex" justifyContent="center" mb={3}>
        <ArrowDatePicker
          selectedDate={selectedDate}
          onChange={setSelectedDate}
        />
      </Box>

      {/* Calories Summary Card */}
      <Fade in timeout={300}>
        <Paper
          elevation={1}
          sx={{
            p: 2.5,
            mb: 3,
            borderRadius: 2,
            background:
              theme.palette.mode === "dark"
                ? `linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)`
                : `linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)`,
            border: `1px solid ${theme.palette.divider}`,
            position: "relative",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <LocalFireDepartment
                sx={{ color: MACRO_CHART_COLORS.calories, fontSize: 20 }}
              />
              <Typography variant="h6" fontWeight="500">
                Calories
              </Typography>
            </Stack>
            {macroGoal && (
              <Chip
                size="small"
                label={
                  getStatusInfo(macros?.calories ?? 0, goalCalories).status
                }
                color={
                  getStatusInfo(macros?.calories ?? 0, goalCalories).color as
                    | "success"
                    | "warning"
                    | "info"
                    | "error"
                }
                icon={getStatusInfo(macros?.calories ?? 0, goalCalories).icon}
                sx={{ textTransform: "capitalize" }}
              />
            )}
          </Stack>

          <Typography variant="h4" fontWeight="700" mb={1}>
            {(macros?.calories ?? 0).toFixed(0)}
            <Typography
              component="span"
              variant="body1"
              color="text.secondary"
              ml={1}
            >
              {macroGoal ? `/ ${goalCalories.toFixed(0)} kcal` : "kcal"}
            </Typography>
          </Typography>

          {macroGoal && (
            <EnhancedProgressBar
              value={
                goalCalories
                  ? ((macros?.calories ?? 0) / goalCalories) * 100
                  : 0
              }
              color={MACRO_CHART_COLORS.calories}
              goal={goalCalories}
              current={macros?.calories ?? 0}
              name="Calories"
              unit=" kcal"
            />
          )}

          {!macroGoal && (
            <Typography
              variant="body2"
              color="text.secondary"
              fontStyle="italic"
              sx={{ mt: 1 }}
            >
              Set macro goals to track progress
            </Typography>
          )}
        </Paper>
      </Fade>

      {/* Macros Grid */}
      <Stack spacing={2}>
        {macroList.map((macro, index) => {
          const progress = macro.goal ? (macro.value / macro.goal) * 100 : 0; // Show 0% when no goal is set

          const statusInfo = getStatusInfo(macro.value, macro.goal);

          return (
            <Zoom in timeout={400 + index * 100} key={macro.name}>
              <Paper
                elevation={1}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  background: macro.gradient,
                  border: `1px solid ${macro.color}22`,
                  position: "relative",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: `0 8px 25px ${macro.color}15`,
                    border: `1px solid ${macro.color}44`,
                  },
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={2}
                >
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    {macro.icon}
                    <Typography variant="h6" fontWeight="500">
                      {macro.name}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body1" fontWeight="600">
                      {macro.value.toFixed(1)}
                      {macro.unit}
                      {macro.goal && (
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          ml={0.5}
                        >
                          / {macro.goal.toFixed(1)}
                          {macro.unit}
                        </Typography>
                      )}
                    </Typography>
                    {macro.goal && (
                      <Tooltip title={`${statusInfo.status.replace("-", " ")}`}>
                        <Box
                          sx={{
                            color: `${statusInfo.color}.main`,
                            display: "flex",
                          }}
                        >
                          {statusInfo.icon}
                        </Box>
                      </Tooltip>
                    )}
                  </Stack>
                </Stack>

                {macro.goal ? (
                  <EnhancedProgressBar
                    value={Math.max(progress, 0)}
                    color={macro.color}
                    goal={macro.goal}
                    current={macro.value}
                    name={macro.name}
                    unit={macro.unit}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 12,
                      borderRadius: 6,
                      backgroundColor:
                        theme.palette.mode === "dark" ? "#2a2a2a" : "#f0f0f0",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontSize: "0.6rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      No goal set
                    </Typography>
                  </Box>
                )}

                {!macro.goal && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, display: "block" }}
                  >
                    {total > 0
                      ? `${((macro.value / total) * 100).toFixed(1)}% of today's intake`
                      : "Set macro goals to track progress"}
                  </Typography>
                )}
              </Paper>
            </Zoom>
          );
        })}
      </Stack>

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
    </Paper>
  );
};

export default MacrosChart;
