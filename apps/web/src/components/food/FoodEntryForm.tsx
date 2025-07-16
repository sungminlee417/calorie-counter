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
    onChange({
      ...foodEntry,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Stack>
      <TextField
        select
        label="Food"
        name="food_id"
        value={foodEntry.food_id}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      >
        {foods?.map((food) => (
          <MenuItem key={food.id} value={food.id}>
            {food.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Quantity"
        name="quantity"
        type="number"
        value={foodEntry.quantity}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
        inputProps={{ min: 1 }}
      />
    </Stack>
  );
};

export default FoodEntryForm;
