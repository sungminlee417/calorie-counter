import React, { useState, useEffect } from "react";
import { TextField, Stack } from "@mui/material";

import { FoodCreationAttributes } from "@calorie-counter/sequelize";

export interface CreateFoodDialogProps {}

const initialState: FoodCreationAttributes = {
  name: "",
  brand: "",
  servingSize: undefined,
  servingUnit: "",
  calories: undefined,
  protein: undefined,
  carbs: undefined,
  fat: undefined,
  fiber: undefined,
  sugar: undefined,
  sodium: undefined,
};

const CreateFoodForm: React.FC<CreateFoodDialogProps> = ({}) => {
  const [form, setForm] = useState<FoodCreationAttributes>(initialState);

  // Reset form when dialog opens or foodType changes
  useEffect(() => {
    setForm(initialState);
  }, [open]);

  // Handle input change for number or string fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
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
        value={form.name}
        onChange={handleChange}
        fullWidth
        required
      />
      <TextField
        label="Brand"
        name="brand"
        value={form.brand}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Serving Size"
        name="servingSize"
        type="number"
        value={form.servingSize ?? ""}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Serving Unit"
        name="servingUnit"
        value={form.servingUnit}
        onChange={handleChange}
        fullWidth
      />

      <TextField
        label="Calories"
        name="calories"
        type="number"
        value={form.calories ?? ""}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Sugar (g)"
        name="sugar"
        type="number"
        value={form.sugar ?? ""}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Fiber (g)"
        name="fiber"
        type="number"
        value={form.fiber ?? ""}
        onChange={handleChange}
        fullWidth
      />

      <TextField
        label="Sodium (mg)"
        name="sodium"
        type="number"
        value={form.sodium ?? ""}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Protein (g)"
        name="protein"
        type="number"
        value={form.protein ?? ""}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Carbs (g)"
        name="carbs"
        type="number"
        value={form.carbs ?? ""}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Fat (g)"
        name="fat"
        type="number"
        value={form.fat ?? ""}
        onChange={handleChange}
        fullWidth
      />
    </Stack>
  );
};

export default CreateFoodForm;
