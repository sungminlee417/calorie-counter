"use client";

import React, { Fragment, useCallback, useState } from "react";

import {
  TextField,
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

import Dialog from "../ui/Dialog";
import FoodForm from "./FoodForm";
import DialogFormActions from "../ui/DialogFormActions";
import {
  FoodAttributes,
  FoodCreationAttributes,
} from "@calorie-counter/sequelize";

const EMPTY_FOOD: FoodAttributes | FoodCreationAttributes = {
  name: "",
  brand: "",
  servingSize: undefined,
  servingUnit: "",
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  fiber: 0,
  sugar: 0,
  sodium: 0,
};

const FoodList = () => {
  const { createFood, deleteFood, foods, updateFood } = useFoods();

  const [searchTerm, setSearchTerm] = useState("");

  const [isFoodDialogOpen, setIsFoodDialogOpen] = useState(false);
  const [editedFood, setEditedFood] = useState<
    FoodAttributes | FoodCreationAttributes
  >(EMPTY_FOOD);

  const handleSaveFood = useCallback(
    (food: FoodAttributes | FoodCreationAttributes) => {
      food.id
        ? updateFood(food as FoodAttributes)
        : createFood(food as FoodCreationAttributes);
      setEditedFood(EMPTY_FOOD);
      setIsFoodDialogOpen(false);
    },
    []
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

      <TextField
        fullWidth
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for a specific food..."
        value={searchTerm}
        sx={{ mb: 2 }}
      />

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
