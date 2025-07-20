"use client";

import React from "react";
import { MenuItem, TextField, Stack } from "@mui/material";

import useFoods from "@/hooks/useFoods";
import { FoodEntry } from "@/types/supabase";
import { mealTypes } from "@/types/food-entry";

export interface FoodEntryFormProps {
  foodEntry: FoodEntry;
  onChange: (updatedFoodEntry: FoodEntry) => void;
}

const FoodEntryForm: React.FC<FoodEntryFormProps> = ({
  foodEntry,
  onChange,
}) => {
  const { foods } = useFoods();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onChange({
      ...foodEntry,
      [name]: name === "quantity" ? Number(value) : value,
    });
  };

  return (
    <Stack spacing={3}>
      <TextField
        select
        id="food_id"
        label="Select Food"
        name="food_id"
        value={foodEntry.food_id}
        onChange={handleChange}
        variant="outlined"
        helperText="Choose a food item from your list"
      >
        {foods?.map((food) => (
          <MenuItem key={food.id} value={food.id}>
            {food.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        id="quantity"
        label="Servings"
        name="quantity"
        type="number"
        value={foodEntry.quantity}
        onChange={handleChange}
        fullWidth
        required
        helperText="Enter the number of servings (e.g., 1.5)"
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
      >
        {mealTypes.map((meal) => (
          <MenuItem key={meal} value={meal}>
            {meal.charAt(0).toUpperCase() + meal.slice(1)}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
};

export default FoodEntryForm;
