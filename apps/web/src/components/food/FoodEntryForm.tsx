"use client";

import React, { useEffect, useState } from "react";
import {
  MenuItem,
  TextField,
  Stack,
  Autocomplete,
  Paper,
  Typography,
  Box,
  useTheme,
  Chip,
  Fade,
} from "@mui/material";
import {
  Restaurant,
  LocalFireDepartment,
  EmojiNature,
  FitnessCenter,
  AccessTime,
} from "@mui/icons-material";

import useFoods from "@/hooks/useFoods";
import useDebounce from "@/hooks/useDebounce";
import { FoodEntry } from "@/types/supabase";
import { MealType, mealTypes } from "@/types/food-entry";
import {
  SEARCH_DEBOUNCE_DELAY,
  SEARCH_MIN_LENGTH,
  MACRO_CHART_COLORS,
  UI_COLORS,
} from "@/constants/app";

export interface FoodEntryFormProps {
  foodEntry: FoodEntry;
  onChange: (updatedFoodEntry: FoodEntry) => void;
  selectedMeal: MealType;
}

const FoodEntryForm: React.FC<FoodEntryFormProps> = ({
  foodEntry,
  onChange,
  selectedMeal,
}) => {
  const theme = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm.trim(), SEARCH_DEBOUNCE_DELAY);

  const { foods, isLoading } = useFoods(
    debouncedSearch.length >= SEARCH_MIN_LENGTH ? debouncedSearch : ""
  );

  // Get meal type icon and color
  const getMealTypeInfo = (meal: MealType) => {
    switch (meal) {
      case "breakfast":
        return {
          icon: <LocalFireDepartment />,
          color: MACRO_CHART_COLORS.calories,
          label: "Breakfast",
        };
      case "lunch":
        return {
          icon: <Restaurant />,
          color: MACRO_CHART_COLORS.carbs,
          label: "Lunch",
        };
      case "dinner":
        return {
          icon: <EmojiNature />,
          color: MACRO_CHART_COLORS.fat,
          label: "Dinner",
        };
      case "snacks":
        return {
          icon: <FitnessCenter />,
          color: MACRO_CHART_COLORS.protein,
          label: "Snacks",
        };
      default:
        return {
          icon: <AccessTime />,
          color: theme.palette.text.secondary,
          label: meal,
        };
    }
  };

  const selectedFood = foods.find((f) => f.id === foodEntry.food_id);

  const handleFoodChange = (newValue: (typeof foods)[number] | null) => {
    onChange({
      ...foodEntry,
      food_id: newValue ? newValue.id : 0,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onChange({
      ...foodEntry,
      [name]: name === "quantity" ? Number(value) : value,
    });
  };

  useEffect(() => {
    if (!isLoaded) {
      onChange({ ...foodEntry, meal_type: selectedMeal });
      setIsLoaded(true);
    }
  }, [foodEntry, isLoaded, onChange, selectedMeal]);

  return (
    <Stack spacing={3}>
      {/* Food Selection Section */}
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
        <Stack spacing={2}>
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Restaurant sx={{ color: MACRO_CHART_COLORS.carbs }} />
            Food Selection
          </Typography>

          <Autocomplete
            loading={isLoading}
            options={debouncedSearch.length >= SEARCH_MIN_LENGTH ? foods : []}
            getOptionLabel={(option) => option.name}
            value={selectedFood || null}
            onChange={(e, newValue) => handleFoodChange(newValue)}
            inputValue={searchTerm}
            onInputChange={(event, newInputValue) =>
              setSearchTerm(newInputValue)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search for food"
                variant="outlined"
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
              />
            )}
            renderOption={(props, option) => (
              <Box
                component="li"
                {...props}
                sx={{
                  p: 2,
                  borderRadius: 1,
                  "&:hover": {
                    background: `${MACRO_CHART_COLORS.carbs}15`,
                  },
                }}
              >
                <Stack>
                  <Typography variant="body1" fontWeight="500">
                    {option.name}
                  </Typography>
                  {option.brand && (
                    <Typography variant="caption" color="text.secondary">
                      {option.brand}
                    </Typography>
                  )}
                  <Stack direction="row" spacing={1} mt={0.5}>
                    {option.calories && (
                      <Chip
                        size="small"
                        label={`${option.calories} kcal`}
                        sx={{
                          fontSize: "0.7rem",
                          height: 18,
                          backgroundColor: `${MACRO_CHART_COLORS.calories}15`,
                          color: MACRO_CHART_COLORS.calories,
                        }}
                      />
                    )}
                    {option.protein && (
                      <Chip
                        size="small"
                        label={`${option.protein}g protein`}
                        sx={{
                          fontSize: "0.7rem",
                          height: 18,
                          backgroundColor: `${MACRO_CHART_COLORS.protein}15`,
                          color: MACRO_CHART_COLORS.protein,
                        }}
                      />
                    )}
                  </Stack>
                </Stack>
              </Box>
            )}
            loadingText="Loading more foods..."
            noOptionsText={
              debouncedSearch.length < SEARCH_MIN_LENGTH
                ? `Type at least ${SEARCH_MIN_LENGTH} letters to search`
                : "No foods found"
            }
            sx={{
              "& .MuiAutocomplete-listbox": {
                maxHeight: 200,
              },
            }}
          />

          {selectedFood && (
            <Fade in>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: `${MACRO_CHART_COLORS.carbs}08`,
                  border: `1px solid ${MACRO_CHART_COLORS.carbs}22`,
                }}
              >
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Selected: {selectedFood.name}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {selectedFood.calories && (
                    <Chip
                      size="small"
                      icon={<LocalFireDepartment />}
                      label={`${selectedFood.calories} kcal`}
                      sx={{
                        backgroundColor: `${MACRO_CHART_COLORS.calories}15`,
                        color: MACRO_CHART_COLORS.calories,
                      }}
                    />
                  )}
                  {selectedFood.protein && (
                    <Chip
                      size="small"
                      icon={<FitnessCenter />}
                      label={`${selectedFood.protein}g protein`}
                      sx={{
                        backgroundColor: `${MACRO_CHART_COLORS.protein}15`,
                        color: MACRO_CHART_COLORS.protein,
                      }}
                    />
                  )}
                  {selectedFood.fat && (
                    <Chip
                      size="small"
                      icon={<EmojiNature />}
                      label={`${selectedFood.fat}g fat`}
                      sx={{
                        backgroundColor: `${MACRO_CHART_COLORS.fat}15`,
                        color: MACRO_CHART_COLORS.fat,
                      }}
                    />
                  )}
                  {selectedFood.carbs && (
                    <Chip
                      size="small"
                      icon={<Restaurant />}
                      label={`${selectedFood.carbs}g carbs`}
                      sx={{
                        backgroundColor: `${MACRO_CHART_COLORS.carbs}15`,
                        color: MACRO_CHART_COLORS.carbs,
                      }}
                    />
                  )}
                </Stack>
              </Paper>
            </Fade>
          )}
        </Stack>
      </Paper>

      {/* Quantity and Meal Type Section */}
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
        <Stack spacing={2}>
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <FitnessCenter sx={{ color: MACRO_CHART_COLORS.protein }} />
            Serving Details
          </Typography>

          <TextField
            id="quantity"
            label="Number of Servings"
            name="quantity"
            type="number"
            value={foodEntry.quantity}
            onChange={handleChange}
            fullWidth
            required
            helperText="Enter the number of servings (e.g., 1.5)"
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
          />

          <TextField
            select
            id="meal_type"
            label="Meal Type"
            name="meal_type"
            value={foodEntry.meal_type}
            onChange={handleChange}
            fullWidth
            required
            helperText="Choose which meal this entry belongs to"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: getMealTypeInfo(foodEntry.meal_type).color,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: getMealTypeInfo(foodEntry.meal_type).color,
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: getMealTypeInfo(foodEntry.meal_type).color,
              },
            }}
          >
            {mealTypes.map((meal) => {
              const mealInfo = getMealTypeInfo(meal);
              return (
                <MenuItem
                  key={meal}
                  value={meal}
                  sx={{
                    "&:hover": {
                      backgroundColor: `${mealInfo.color}15`,
                    },
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box sx={{ color: mealInfo.color }}>{mealInfo.icon}</Box>
                    <Typography>{mealInfo.label}</Typography>
                  </Stack>
                </MenuItem>
              );
            })}
          </TextField>

          {/* Current Selection Summary */}
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              background: `${getMealTypeInfo(foodEntry.meal_type).color}08`,
              border: `1px solid ${getMealTypeInfo(foodEntry.meal_type).color}22`,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box sx={{ color: getMealTypeInfo(foodEntry.meal_type).color }}>
                {getMealTypeInfo(foodEntry.meal_type).icon}
              </Box>
              <Typography variant="body2">
                Adding to{" "}
                <strong>{getMealTypeInfo(foodEntry.meal_type).label}</strong>
                {foodEntry.quantity > 0 && (
                  <span>
                    {" "}
                    • {foodEntry.quantity} serving
                    {foodEntry.quantity > 1 ? "s" : ""}
                  </span>
                )}
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default FoodEntryForm;
