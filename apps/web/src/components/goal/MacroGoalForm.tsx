import { MacroGoal } from "@/types/supabase";
import {
  EmojiNature,
  FitnessCenter,
  Restaurant,
  LocalFireDepartment,
} from "@mui/icons-material";
import { Stack, InputAdornment, Typography, useTheme } from "@mui/material";
import { SmallCard, FormField } from "@/components/styled";
import React, { useEffect } from "react";
import { MACRO_CHART_COLORS, UI_COLORS } from "@/constants/app";

export interface MacroGoalFormProps {
  macroGoal: MacroGoal;
  onChange: (updatedMacroGoal: MacroGoal) => void;
}

const MacroGoalsForm: React.FC<MacroGoalFormProps> = ({
  macroGoal,
  onChange,
}) => {
  const theme = useTheme();
  const handleChange =
    (field: keyof MacroGoal) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange({
        ...macroGoal,
        [field]: parseInt(event.target.value) || 0,
      });
    };

  useEffect(() => {
    const { protein = 0, fat = 0, carbs = 0, calories = 0 } = macroGoal;
    const calculatedCalories =
      (protein ?? 0) * 4 + (carbs ?? 0) * 4 + (fat ?? 0) * 9;

    if (calories !== calculatedCalories) {
      onChange({
        ...macroGoal,
        calories: calculatedCalories,
      });
    }
  }, [macroGoal.protein, macroGoal.fat, macroGoal.carbs, macroGoal, onChange]);

  return (
    <Stack spacing={3}>
      {/* Calories Section */}
      <SmallCard
        elevation={1}
        sx={{
          p: 3,
          borderRadius: 3,
          background: `${MACRO_CHART_COLORS.calories}08`,
          border: `1px solid ${MACRO_CHART_COLORS.calories}22`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <LocalFireDepartment sx={{ color: MACRO_CHART_COLORS.calories }} />
          <Typography variant="h6" fontWeight="600">
            Total Calories
          </Typography>
        </Stack>

        <FormField
          label="Calories (auto-calculated)"
          type="number"
          value={macroGoal.calories ?? 0}
          disabled
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocalFireDepartment
                  sx={{ color: MACRO_CHART_COLORS.calories }}
                />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(255,255,255,0.8)",
            },
          }}
          helperText="Total calories calculated from your macro targets (Protein: 4 kcal/g, Carbs: 4 kcal/g, Fat: 9 kcal/g)"
        />
      </SmallCard>

      {/* Macros Section */}
      <SmallCard
        elevation={1}
        sx={{
          p: 3,
          borderRadius: 3,
          background:
            theme.palette.mode === "dark"
              ? UI_COLORS.gradients.neutral.dark
              : UI_COLORS.gradients.neutral.light,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6" fontWeight="600" mb={3}>
          Macro Targets
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <FormField
            label="Carbs (g)"
            type="number"
            value={macroGoal.carbs ?? 0}
            onChange={handleChange("carbs")}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Restaurant sx={{ color: MACRO_CHART_COLORS.carbs }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: MACRO_CHART_COLORS.carbs,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: MACRO_CHART_COLORS.carbs,
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: MACRO_CHART_COLORS.carbs,
              },
            }}
            helperText="Daily carb target (4 kcal per gram)"
          />

          <FormField
            label="Fat (g)"
            type="number"
            value={macroGoal.fat ?? 0}
            onChange={handleChange("fat")}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmojiNature sx={{ color: MACRO_CHART_COLORS.fat }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: MACRO_CHART_COLORS.fat,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: MACRO_CHART_COLORS.fat,
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: MACRO_CHART_COLORS.fat,
              },
            }}
            helperText="Daily fat target (9 kcal per gram)"
          />

          <FormField
            label="Protein (g)"
            type="number"
            value={macroGoal.protein ?? 0}
            onChange={handleChange("protein")}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FitnessCenter sx={{ color: MACRO_CHART_COLORS.protein }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: MACRO_CHART_COLORS.protein,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: MACRO_CHART_COLORS.protein,
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: MACRO_CHART_COLORS.protein,
              },
            }}
            helperText="Daily protein target (4 kcal per gram)"
          />
        </Stack>
      </SmallCard>
    </Stack>
  );
};

export default MacroGoalsForm;
