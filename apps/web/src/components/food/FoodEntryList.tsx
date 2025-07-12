"use client";

import React, { Fragment, useCallback, useState } from "react";
import dayjs from "dayjs";

import {
  FoodEntryAttributes,
  FoodEntryCreationAttributes,
} from "@calorie-counter/sequelize";

import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Stack,
  Divider,
} from "@mui/material";
import { Add, Edit } from "@mui/icons-material";

import Dialog from "../ui/Dialog";
import FoodEntryForm from "./FoodEntryForm";
import DialogFormActions from "../ui/DialogFormActions";
import useFoodEntries from "@/hooks/useFoodEntries";

const EMPTY_FOOD_ENTRY: FoodEntryCreationAttributes = {
  foodId: 0,
  date: dayjs().startOf("day").toDate(),
  quantity: 1,
};

const FoodEntryList = () => {
  const { createFoodEntry, deleteFoodEntry, foodEntries, updateFoodEntry } =
    useFoodEntries();

  const [isFoodEntryDialogOpen, setIsFoodEntryDialogOpen] = useState(false);
  const [editedFoodEntry, setEditedFoodEntry] = useState<
    FoodEntryAttributes | FoodEntryCreationAttributes
  >(EMPTY_FOOD_ENTRY);

  const handleSaveFoodEntry = useCallback(
    (foodEntry: FoodEntryAttributes | FoodEntryCreationAttributes) => {
      foodEntry.id
        ? updateFoodEntry(foodEntry as FoodEntryAttributes)
        : createFoodEntry(foodEntry as FoodEntryCreationAttributes);
      setEditedFoodEntry(EMPTY_FOOD_ENTRY);
      setIsFoodEntryDialogOpen(false);
    },
    [createFoodEntry, updateFoodEntry]
  );

  const handleDeleteFoodEntry = useCallback(
    (foodEntryId: string) => {
      deleteFoodEntry(foodEntryId);
      setEditedFoodEntry(EMPTY_FOOD_ENTRY);
      setIsFoodEntryDialogOpen(false);
    },
    [deleteFoodEntry]
  );

  const handleEditClick = (entry: FoodEntryAttributes) => {
    setEditedFoodEntry(entry);
    setIsFoodEntryDialogOpen(true);
  };

  return (
    <Box>
      <Stack alignItems="center" direction="row" height="fit-content" mb={2}>
        <Typography variant="h6" gutterBottom flex={1}>
          Food Entries
        </Typography>

        <IconButton onClick={() => setIsFoodEntryDialogOpen(true)}>
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
        {foodEntries?.length === 0 ? (
          <Typography>No food entries yet.</Typography>
        ) : (
          <List>
            {foodEntries?.map((entry, idx) => (
              <Fragment key={entry.id}>
                <ListItem
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => handleEditClick(entry)}
                    >
                      <Edit />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={`Food ID: ${entry.foodId} x ${entry.quantity}`}
                    secondary={dayjs(entry.date).format("MMM D, YYYY")}
                  />
                </ListItem>
                {idx < foodEntries.length - 1 && <Divider component="li" />}
              </Fragment>
            ))}
          </List>
        )}
      </Box>

      <Dialog
        dialogActions={
          <DialogFormActions
            onCancel={() => setIsFoodEntryDialogOpen(false)}
            onDelete={
              editedFoodEntry.id
                ? () => handleDeleteFoodEntry(String(editedFoodEntry.id))
                : undefined
            }
            onSave={() => handleSaveFoodEntry(editedFoodEntry)}
          />
        }
        onClose={() => setIsFoodEntryDialogOpen(false)}
        open={isFoodEntryDialogOpen}
        title={editedFoodEntry.id ? "Edit Food Entry" : "Create Food Entry"}
      >
        <FoodEntryForm
          foodEntry={editedFoodEntry}
          onChange={(updatedFoodEntry) => setEditedFoodEntry(updatedFoodEntry)}
        />
      </Dialog>
    </Box>
  );
};

export default FoodEntryList;
