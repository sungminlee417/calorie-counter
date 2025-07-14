"use client";

import React, { Fragment, useCallback, useState } from "react";

import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Stack,
  IconButton,
} from "@mui/material";
import { Add, Edit } from "@mui/icons-material";

import useFoods from "@/hooks/useFoods";
import { Food } from "@/types/supabase";

import Dialog from "../ui/Dialog";
import FoodForm from "./FoodForm";
import DialogFormActions from "../ui/DialogFormActions";

const EMPTY_FOOD: Food = {
  name: "",
  serving_size: 0,
  serving_unit: "",
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  id: 0,
  created_at: null,
  updated_at: null,
  brand: null,
  user_id: "",
};

const FoodList = () => {
  const { createFood, deleteFood, foods, updateFood } = useFoods();

  const [isFoodDialogOpen, setIsFoodDialogOpen] = useState(false);
  const [editedFood, setEditedFood] = useState<Food>(EMPTY_FOOD);

  const handleSaveFood = useCallback(
    (food: Food) => {
      const foodToSave = {
        name: food.name,
        serving_size: food.serving_size,
        serving_unit: food.serving_unit,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        user_id: food.user_id,
        brand: food.brand,
      };
      if (food.id) updateFood(food);
      else createFood(foodToSave);
      setEditedFood(EMPTY_FOOD);
      setIsFoodDialogOpen(false);
    },
    [createFood, updateFood]
  );

  const handleDeleteFood = useCallback(
    (foodId: string) => {
      deleteFood(foodId);
      setEditedFood(EMPTY_FOOD);
      setIsFoodDialogOpen(false);
    },
    [deleteFood]
  );

  return (
    <Box>
      <Stack alignItems="center" direction="row" height="fit-content" mb={2}>
        <Typography variant="h6" gutterBottom flex={1}>
          Foods
        </Typography>

        <IconButton onClick={() => setIsFoodDialogOpen(true)}>
          <Add />
        </IconButton>
      </Stack>

      <Box
        sx={{
          maxHeight: 300,
          overflowY: "auto",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
        }}
      >
        {!foods?.length ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ p: 2, textAlign: "center" }}
          >
            No foods found.
          </Typography>
        ) : (
          <List disablePadding>
            {foods?.map((food, idx) => (
              <Fragment key={food.id}>
                <ListItem
                  secondaryAction={
                    <IconButton
                      onClick={() => {
                        setEditedFood(food);
                        setIsFoodDialogOpen(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={food.name}
                    secondary={`Calories: ${food.calories} | Carbs: ${food.carbs}g | Fats: ${food.fat}g | Protein: ${food.protein}g`}
                  />
                </ListItem>
                {idx < foods.length - 1 && <Divider component="li" />}
              </Fragment>
            ))}
          </List>
        )}
      </Box>

      <Dialog
        dialogActions={
          <DialogFormActions
            onCancel={() => setIsFoodDialogOpen(false)}
            onDelete={
              editedFood.id
                ? () => handleDeleteFood(String(editedFood.id))
                : undefined
            }
            onSave={() => handleSaveFood(editedFood)}
          />
        }
        onClose={() => setIsFoodDialogOpen(false)}
        open={isFoodDialogOpen}
        title={editedFood.id ? "Edit Food" : "Create Food"}
      >
        <FoodForm
          food={editedFood}
          onChange={(updatedFood) => setEditedFood(updatedFood)}
        />
      </Dialog>
    </Box>
  );
};

export default FoodList;
