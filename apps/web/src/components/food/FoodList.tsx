"use client";

import React, { useCallback, useState } from "react";

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
import { Add } from "@mui/icons-material";

import useFoods from "@/hooks/useFoods";

import Dialog from "../ui/Dialog";
import CreateFoodForm from "./CreateFoodForm";
import DialogFormActions from "../ui/DialogFormActions";
import { FoodCreationAttributes } from "@calorie-counter/sequelize";

const FoodList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [isCreateFoodDialogOpen, setIsCreateFoodDialogOpen] = useState(false);
  const [editedFood, setEditedFood] = useState<
    FoodCreationAttributes | undefined
  >();

  const { createFood, foods } = useFoods();

  const handleSaveFood = useCallback((food: FoodCreationAttributes) => {
    createFood(food);
    setIsCreateFoodDialogOpen(false);
  }, []);

  return (
    <Box>
      <Stack alignItems="center" direction="row" height="fit-content" mb={2}>
        <Typography variant="h6" gutterBottom flex={1}>
          Foods
        </Typography>

        <IconButton onClick={() => setIsCreateFoodDialogOpen(true)}>
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
              <React.Fragment key={food.id}>
                <ListItem>
                  <ListItemText
                    primary={food.name}
                    secondary={`Calories: ${food.calories} | Carbs: ${food.carbs}g | Fats: ${food.fat}g | Protein: ${food.protein}g`}
                  />
                </ListItem>
                {idx < foods.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>

      <Dialog
        dialogActions={
          <DialogFormActions
            onCancel={() => setIsCreateFoodDialogOpen(false)}
            onSave={() => {
              setIsCreateFoodDialogOpen(false);
            }}
          />
        }
        onClose={() => setIsCreateFoodDialogOpen(false)}
        open={isCreateFoodDialogOpen}
        title="Create Food"
      >
        <CreateFoodForm />
      </Dialog>
    </Box>
  );
};

export default FoodList;
