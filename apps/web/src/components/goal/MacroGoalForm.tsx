import { MacroGoal } from "@/types/supabase";
import {
  EmojiNature,
  FitnessCenter,
  Restaurant,
  LocalFireDepartment,
} from "@mui/icons-material";
import { Stack, TextField } from "@mui/material";
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
    <Stack spacing={2} mt={1}>
      <TextField
        label="Calories (auto-calculated)"
        type="number"
        value={macroGoal.calories ?? 0}
        onChange={handleChange("calories")}
        disabled
        fullWidth
        InputProps={{
          startAdornment: <LocalFireDepartment sx={{ mr: 1 }} color="error" />,
        }}
      />
      <TextField
        label="Protein (g)"
        type="number"
        value={macroGoal.protein ?? 0}
        onChange={handleChange("protein")}
        fullWidth
        InputProps={{
          startAdornment: <FitnessCenter sx={{ mr: 1 }} color="primary" />,
        }}
      />
      <TextField
        label="Fat (g)"
        type="number"
        value={macroGoal.fat ?? 0}
        onChange={handleChange("fat")}
        fullWidth
        InputProps={{
          startAdornment: <EmojiNature sx={{ mr: 1, color: "#43a047" }} />,
        }}
      />
      <TextField
        label="Carbs (g)"
        type="number"
        value={macroGoal.carbs ?? 0}
        onChange={handleChange("carbs")}
        fullWidth
        InputProps={{
          startAdornment: <Restaurant sx={{ mr: 1, color: "#ff9800" }} />,
        }}
      />
    </Stack>
  );
};

export default MacroGoalsForm;
