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
  Skeleton,
  Paper,
  Tooltip,
} from "@mui/material";
import { Add, Edit } from "@mui/icons-material";

import useFoods from "@/hooks/useFoods";
import useUser from "@/hooks/useUser";
import { Food } from "@/types/supabase";

import Dialog from "../ui/Dialog";
import FoodForm from "./FoodForm";
import DialogFormActions from "../ui/DialogFormActions";

const EMPTY_FOOD: Food = {
  id: 0,
  name: "",
  brand: null,
  serving_size: 0,
  serving_unit: "",
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  created_at: null,
  updated_at: null,
  user_id: "",
};

const FoodList = () => {
  const { user } = useUser();
  const { createFood, deleteFood, foods, updateFood, isLoading } = useFoods();

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
        brand: food.brand,
        user_id: food.user_id,
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

  const openEditDialog = (food: Food) => {
    setEditedFood(food);
    setIsFoodDialogOpen(true);
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" mb={2} spacing={2}>
        <Typography variant="h6" flex={1}>
          Foods
        </Typography>
        <Tooltip title="Add new food">
          <IconButton onClick={() => setIsFoodDialogOpen(true)}>
            <Add />
          </IconButton>
        </Tooltip>
      </Stack>

      <Paper
        variant="outlined"
        sx={{
          maxHeight: 320,
          overflowY: "auto",
          borderRadius: 2,
          px: 1,
          backgroundColor: "background.paper",
        }}
      >
        {isLoading ? (
          <List disablePadding>
            {[...Array(4)].map((_, idx) => (
              <Fragment key={idx}>
                <ListItem>
                  <ListItemText
                    primary={<Skeleton width="60%" />}
                    secondary={<Skeleton width="80%" />}
                  />
                </ListItem>
                {idx < 3 && <Divider component="li" />}
              </Fragment>
            ))}
          </List>
        ) : !foods?.length ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ p: 2, textAlign: "center" }}
          >
            No foods found.
          </Typography>
        ) : (
          <List disablePadding>
            {foods.map((food, idx) => (
              <Fragment key={food.id}>
                <ListItem
                  secondaryAction={
                    <Tooltip title="Edit food">
                      <IconButton onClick={() => openEditDialog(food)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  }
                >
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1">
                        {food.name}
                        {food.brand ? ` (${food.brand})` : ""}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {`Calories: ${food.calories} kcal | Carbs: ${food.carbs}g | Fat: ${food.fat}g | Protein: ${food.protein}g`}
                      </Typography>
                    }
                  />
                </ListItem>
                {idx < foods.length - 1 && <Divider component="li" />}
              </Fragment>
            ))}
          </List>
        )}
      </Paper>

      <Dialog
        open={isFoodDialogOpen}
        onClose={() => setIsFoodDialogOpen(false)}
        title={editedFood.id ? "Edit Food" : "Add Food"}
        dialogActions={
          <DialogFormActions
            onCancel={() => setIsFoodDialogOpen(false)}
            onDelete={
              editedFood.id && editedFood.user_id === user?.id
                ? () => handleDeleteFood(String(editedFood.id))
                : undefined
            }
            onSave={
              editedFood.id && editedFood.user_id === user?.id
                ? () => handleSaveFood(editedFood)
                : undefined
            }
          />
        }
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
