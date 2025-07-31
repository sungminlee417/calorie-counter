"use client";

import React, { useEffect, useState } from "react";
import { MenuItem, TextField, Stack, Autocomplete } from "@mui/material";

import useFoods from "@/hooks/useFoods";
import useDebounce from "@/hooks/useDebounce";
import { FoodEntry } from "@/types/supabase";
import { MealType, mealTypes } from "@/types/food-entry";
import { SEARCH_DEBOUNCE_DELAY, SEARCH_MIN_LENGTH } from "@/constants/app";

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
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm.trim(), SEARCH_DEBOUNCE_DELAY);

  const { foods, isLoading } = useFoods(
    debouncedSearch.length >= SEARCH_MIN_LENGTH ? debouncedSearch : ""
  );

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
      <Autocomplete
        loading={isLoading}
        options={debouncedSearch.length >= SEARCH_MIN_LENGTH ? foods : []}
        getOptionLabel={(option) => option.name}
        value={foods.find((f) => f.id === foodEntry.food_id) || null}
        onChange={(e, newValue) => handleFoodChange(newValue)}
        inputValue={searchTerm}
        onInputChange={(event, newInputValue) => setSearchTerm(newInputValue)}
        renderInput={(params) => (
          <TextField {...params} label="Select Food" variant="outlined" />
        )}
        loadingText="Loading more foods..."
        noOptionsText={
          debouncedSearch.length < SEARCH_MIN_LENGTH
            ? `Type at least ${SEARCH_MIN_LENGTH} letters to search`
            : "No foods found"
        }
      />

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
