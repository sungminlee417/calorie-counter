import React from "react";
import { TextField, Stack } from "@mui/material";

import { Food } from "@/types/supabase";

export interface FoodDialogProps {
  food: Food;
  onChange: (updatedFood: Food) => void;
}

const FoodForm: React.FC<FoodDialogProps> = ({ food, onChange }) => {
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
      <TextField
        label="Name"
        name="name"
        value={food.name}
        onChange={handleChange}
        fullWidth
        required
        helperText="Enter the food name"
      />

      <TextField
        label="Brand"
        name="brand"
        value={food.brand ?? ""}
        onChange={handleChange}
        fullWidth
        helperText="Optional brand or manufacturer"
      />

      <Stack direction="row" spacing={2}>
        <TextField
          label="Serving Size"
          name="serving_size"
          type="number"
          value={food.serving_size ?? ""}
          onChange={handleChange}
          fullWidth
          helperText="Quantity per serving"
          required
        />
        <TextField
          label="Serving Unit"
          name="serving_unit"
          value={food.serving_unit}
          onChange={handleChange}
          fullWidth
          helperText="Unit of measure (e.g., g, oz, piece)"
          required
        />
      </Stack>

      <TextField
        label="Calories"
        name="calories"
        type="number"
        value={food.calories ?? ""}
        onChange={handleChange}
        fullWidth
        helperText="Energy per serving (kcal)"
        required
      />

      <Stack direction="row" spacing={2}>
        <TextField
          label="Protein (g)"
          name="protein"
          type="number"
          value={food.protein ?? ""}
          onChange={handleChange}
          fullWidth
          helperText="Protein content per serving"
          required
        />
        <TextField
          label="Carbs (g)"
          name="carbs"
          type="number"
          value={food.carbs ?? ""}
          onChange={handleChange}
          fullWidth
          helperText="Carbohydrates per serving"
          required
        />
        <TextField
          label="Fat (g)"
          name="fat"
          type="number"
          value={food.fat ?? ""}
          onChange={handleChange}
          fullWidth
          helperText="Fat content per serving"
          required
        />
      </Stack>
    </Stack>
  );
};

export default FoodForm;
