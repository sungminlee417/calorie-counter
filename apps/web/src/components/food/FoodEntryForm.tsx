"use client";

import React from "react";
import { MenuItem, TextField, Stack } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

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

  const handleDateChange = (newDate: Dayjs | null) => {
    if (newDate) {
      onChange({
        ...foodEntry,
        date: newDate.toString(),
      });
    }
  };

  console.log(foodEntry.food_id);

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

      <DatePicker
        label="Date"
        value={dayjs(foodEntry.date)}
        onChange={handleDateChange}
        slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
      />

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
