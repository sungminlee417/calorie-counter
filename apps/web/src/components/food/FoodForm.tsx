import React from "react";
import {
  TextField,
  Stack,
  Paper,
  Typography,
  InputAdornment,
  useTheme,
} from "@mui/material";
import {
  Restaurant,
  LocalFireDepartment,
  FitnessCenter,
  EmojiNature,
  Scale,
  Label,
} from "@mui/icons-material";

import { Food } from "@/types/supabase";
import { MACRO_CHART_COLORS, UI_COLORS } from "@/constants/app";

export interface FoodDialogProps {
  food: Food;
  onChange: (updatedFood: Food) => void;
}

const FoodForm: React.FC<FoodDialogProps> = ({ food, onChange }) => {
  const theme = useTheme();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    onChange({
      ...food,
      [name]:
        type === "number" ? (value === "" ? undefined : Number(value)) : value,
    });
  };

  return (
    <Stack spacing={3}>
      {/* Basic Information Section */}
      <Paper
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
        <Stack direction="row" alignItems="center" spacing={2} mb={3}>
          <Restaurant sx={{ color: MACRO_CHART_COLORS.carbs }} />
          <Typography variant="h6" fontWeight="600">
            Basic Information
          </Typography>
        </Stack>

        <Stack spacing={2}>
          <TextField
            label="Food Name"
            name="name"
            value={food.name}
            onChange={handleChange}
            fullWidth
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Label sx={{ color: MACRO_CHART_COLORS.carbs }} />
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
            helperText="Enter the food name"
          />

          <TextField
            label="Brand (Optional)"
            name="brand"
            value={food.brand ?? ""}
            onChange={handleChange}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
            helperText="Optional brand or manufacturer"
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Serving Size"
              name="serving_size"
              type="number"
              value={food.serving_size ?? ""}
              onChange={handleChange}
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Scale sx={{ color: theme.palette.text.secondary }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
              helperText="Quantity per serving"
            />
            <TextField
              label="Serving Unit"
              name="serving_unit"
              value={food.serving_unit}
              onChange={handleChange}
              fullWidth
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
              helperText="Unit (e.g., g, oz, piece)"
            />
          </Stack>
        </Stack>
      </Paper>

      {/* Calories Section */}
      <Paper
        elevation={1}
        sx={{
          p: 3,
          borderRadius: 3,
          background: `${MACRO_CHART_COLORS.calories}08`,
          border: `1px solid ${MACRO_CHART_COLORS.calories}22`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} mb={3}>
          <LocalFireDepartment sx={{ color: MACRO_CHART_COLORS.calories }} />
          <Typography variant="h6" fontWeight="600">
            Energy Content
          </Typography>
        </Stack>

        <TextField
          label="Calories"
          name="calories"
          type="number"
          value={food.calories ?? ""}
          onChange={handleChange}
          fullWidth
          required
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
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: MACRO_CHART_COLORS.calories,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: MACRO_CHART_COLORS.calories,
              },
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: MACRO_CHART_COLORS.calories,
            },
          }}
          helperText="Energy per serving (kcal)"
        />
      </Paper>

      {/* Macronutrients Section */}
      <Paper
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
          Macronutrients
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Carbs (g)"
            name="carbs"
            type="number"
            value={food.carbs ?? ""}
            onChange={handleChange}
            fullWidth
            required
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
            helperText="Carbohydrates per serving"
          />

          <TextField
            label="Fat (g)"
            name="fat"
            type="number"
            value={food.fat ?? ""}
            onChange={handleChange}
            fullWidth
            required
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
            helperText="Fat content per serving"
          />

          <TextField
            label="Protein (g)"
            name="protein"
            type="number"
            value={food.protein ?? ""}
            onChange={handleChange}
            fullWidth
            required
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
            helperText="Protein content per serving"
          />
        </Stack>
      </Paper>
    </Stack>
  );
};

export default FoodForm;
