"use client";

import React from "react";
import { MenuItem, TextField, Stack } from "@mui/material";

import useFoods from "@/hooks/useFoods";
import { FoodEntry } from "@/types/supabase";

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
    </Stack>
  );
};

export default FoodEntryForm;
