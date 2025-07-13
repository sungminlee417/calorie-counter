"use client";

import React, { Fragment, useCallback, useState } from "react";
import dayjs from "dayjs";

import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Stack,
  Divider,
  TextField,
} from "@mui/material";
import { Add, Edit } from "@mui/icons-material";

import useFoodEntries from "@/hooks/useFoodEntries";
import { FoodEntry } from "@/types/supabase";

import Dialog from "../ui/Dialog";
import FoodEntryForm from "./FoodEntryForm";
import DialogFormActions from "../ui/DialogFormActions";

const EMPTY_FOOD_ENTRY: FoodEntry = {
  food_id: 0,
  date: dayjs().toString(),
  quantity: 1,
  created_at: null,
  id: 0,
  updated_at: null,
  user_id: 0,
};

const FoodEntryList = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { createFoodEntry, deleteFoodEntry, foodEntries, updateFoodEntry } =
    useFoodEntries(selectedDate);

  const [isFoodEntryDialogOpen, setIsFoodEntryDialogOpen] = useState(false);
  const [editedFoodEntry, setEditedFoodEntry] =
    useState<FoodEntry>(EMPTY_FOOD_ENTRY);

  const handleSaveFoodEntry = useCallback(
    (foodEntry: FoodEntry) => {
      foodEntry.id ? updateFoodEntry(foodEntry) : createFoodEntry(foodEntry);
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

  const handleEditClick = (entry: FoodEntry) => {
    setEditedFoodEntry(entry);
    setIsFoodEntryDialogOpen(true);
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" mb={2} spacing={2}>
        <Typography variant="h6" flex={1}>
          Food Entries
        </Typography>

        <TextField
          label="Date"
          type="date"
          size="small"
          value={dayjs(selectedDate).format("YYYY-MM-DD")}
          onChange={(e) => {
            const date = dayjs(e.target.value, "YYYY-MM-DD").toDate();
            setSelectedDate(date);
          }}
        />

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
                    primary={
                      <Box>
                        <Typography variant="subtitle1" component="span">
                          {entry.food?.name || "Unknown Food"}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      entry.food?.brand && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          component="span"
                        >
                          {`${entry.food.brand}, ${
                            entry.quantity * (entry.food?.servingSize ?? 1)
                          } ${entry.food?.servingUnit ?? ""}`}
                        </Typography>
                      )
                    }
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
