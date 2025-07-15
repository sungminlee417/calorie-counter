"use client";

import React from "react";
import { MenuItem, TextField, Stack } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

import useFoods from "@/hooks/useFoods";
import { FoodEntry } from "@/types/supabase";
import ArrowDatePicker from "../form/ArrowDatePicker";

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

  const handleDateChange = (newDate: Date | null) => {
    if (newDate) {
      onChange({
        ...foodEntry,
        date: newDate.toString(),
      });
    }
  };

  return (
    <Stack>
      <ArrowDatePicker
        selectedDate={new Date(foodEntry.date)}
        onChange={handleDateChange}
        sx={{ alignSelf: "center" }}
      />
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
