import React from "react";
import { TextField, Stack } from "@mui/material";
import {
  FoodAttributes,
  FoodCreationAttributes,
} from "@calorie-counter/sequelize";

export interface FoodDialogProps {
  food: FoodAttributes | FoodCreationAttributes;
  onChange: (updatedFood: FoodAttributes | FoodCreationAttributes) => void;
}

const FoodForm: React.FC<FoodDialogProps> = ({ food, onChange }) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onChange(() => ({
      ...food,
      [name]:
        e.target.type === "number"
          ? value === ""
            ? undefined
            : Number(value)
          : value,
    }));
  };

  return (
    <Stack gap={1}>
      <TextField
        label="Name"
        name="name"
        value={food.name}
        onChange={handleChange}
        fullWidth
        required
      />
      <TextField
        label="Brand"
        name="brand"
        value={food.brand}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Serving Size"
        name="servingSize"
        type="number"
        value={food.servingSize ?? ""}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Serving Unit"
        name="servingUnit"
        value={food.servingUnit}
        onChange={handleChange}
        fullWidth
      />

      <TextField
        label="Calories"
        name="calories"
        type="number"
        value={food.calories ?? ""}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Sugar (g)"
        name="sugar"
        type="number"
        value={food.sugar ?? ""}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Fiber (g)"
        name="fiber"
        type="number"
        value={food.fiber ?? ""}
        onChange={handleChange}
        fullWidth
      />

      <TextField
        label="Sodium (mg)"
        name="sodium"
        type="number"
        value={food.sodium ?? ""}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Protein (g)"
        name="protein"
        type="number"
        value={food.protein ?? ""}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Carbs (g)"
        name="carbs"
        type="number"
        value={food.carbs ?? ""}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Fat (g)"
        name="fat"
        type="number"
        value={food.fat ?? ""}
        onChange={handleChange}
        fullWidth
      />
    </Stack>
  );
};

export default FoodForm;
