import { MacroGoal } from "@/types/supabase";
import {
  EmojiNature,
  FitnessCenter,
  Restaurant,
  LocalFireDepartment,
} from "@mui/icons-material";
import { Stack, TextField, InputAdornment } from "@mui/material";
import React, { useEffect } from "react";

export interface MacroGoalFormProps {
  macroGoal: MacroGoal;
  onChange: (updatedMacroGoal: MacroGoal) => void;
}

const MacroGoalsForm: React.FC<MacroGoalFormProps> = ({
  macroGoal,
  onChange,
}) => {
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
    <Stack spacing={3} mt={1}>
      <TextField
        label="Calories (auto-calculated)"
        type="number"
        value={macroGoal.calories ?? 0}
        disabled
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LocalFireDepartment color="error" />
            </InputAdornment>
          ),
        }}
        helperText="Total calories based on macros"
      />

      <Stack direction="row" spacing={2}>
        <TextField
          label="Protein (g)"
          type="number"
          value={macroGoal.protein ?? 0}
          onChange={handleChange("protein")}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FitnessCenter color="primary" />
              </InputAdornment>
            ),
          }}
          helperText="Protein intake per day"
        />
        <TextField
          label="Fat (g)"
          type="number"
          value={macroGoal.fat ?? 0}
          onChange={handleChange("fat")}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmojiNature sx={{ color: "#43a047" }} />
              </InputAdornment>
            ),
          }}
          helperText="Fat intake per day"
        />
        <TextField
          label="Carbs (g)"
          type="number"
          value={macroGoal.carbs ?? 0}
          onChange={handleChange("carbs")}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Restaurant sx={{ color: "#ff9800" }} />
              </InputAdornment>
            ),
          }}
          helperText="Carbohydrates intake per day"
        />
      </Stack>
    </Stack>
  );
};

export default MacroGoalsForm;
