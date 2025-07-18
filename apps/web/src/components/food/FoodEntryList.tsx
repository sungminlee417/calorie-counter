/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import React, { Fragment, useCallback, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Stack,
  Divider,
  Skeleton,
  Paper,
  Tooltip,
} from "@mui/material";
import { Add, Edit } from "@mui/icons-material";

import useFoodEntries from "@/hooks/useFoodEntries";
import { FoodEntry } from "@/types/supabase";
import Dialog from "../ui/Dialog";
import FoodEntryForm from "./FoodEntryForm";
import DialogFormActions from "../ui/DialogFormActions";
import { FoodEntryWithFood } from "@/lib/supabase/fetch-food-entry";
import { useDate } from "@/context/DateContext";
import { foodEntrySchema } from "@/types/food-entry";

const EMPTY_FOOD_ENTRY: FoodEntry = {
  id: 0,
  user_id: "",
  food_id: 0,
  quantity: 1,
  created_at: null,
  updated_at: null,
};

const FoodEntryList = () => {
  const { selectedDate } = useDate();
  const {
    createFoodEntry,
    deleteFoodEntry,
    foodEntries,
    updateFoodEntry,
    isLoading,
  } = useFoodEntries(selectedDate);

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editedEntry, setEditedEntry] = useState<FoodEntry>(EMPTY_FOOD_ENTRY);

  const handleSave = useCallback(
    (foodEntry: FoodEntry | FoodEntryWithFood) => {
      const hasFoods = (
        data: FoodEntry | FoodEntryWithFood
      ): data is FoodEntryWithFood => "foods" in data;

      const { created_at, updated_at, id, ...rest } = foodEntry;

      const result = foodEntrySchema.safeParse(rest);
      if (!result.success) {
        console.error("Validation failed:", result.error.flatten());
        return;
      }

      let cleanedEntry: Partial<FoodEntry>;

      if (hasFoods(foodEntry)) {
        const { created_at, updated_at, foods, ...rest } = foodEntry;
        cleanedEntry = { ...rest };
      } else {
        const { id, created_at, updated_at, ...rest } = foodEntry;
        cleanedEntry = { ...rest };
      }

      if (foodEntry.id) {
        updateFoodEntry(
          cleanedEntry as Omit<FoodEntry, "created_at" | "updated_at">
        );
      } else {
        createFoodEntry(
          cleanedEntry as Omit<FoodEntry, "id" | "created_at" | "updated_at">
        );
      }

      setEditedEntry(EMPTY_FOOD_ENTRY);
      setDialogOpen(false);
    },
    [createFoodEntry, updateFoodEntry]
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteFoodEntry(id);
      setEditedEntry(EMPTY_FOOD_ENTRY);
      setDialogOpen(false);
    },
    [deleteFoodEntry]
  );

  const handleEditClick = (entry: FoodEntry) => {
    setEditedEntry(entry);
    setDialogOpen(true);
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" mb={2} spacing={2}>
        <Typography variant="h6" flex={1}>
          Food Entries
        </Typography>
        <Tooltip title="Add new food entry">
          <IconButton onClick={() => setDialogOpen(true)}>
            <Add />
          </IconButton>
        </Tooltip>
      </Stack>

      <Paper
        variant="outlined"
        sx={{
          overflowY: "auto",
          borderRadius: 2,
          px: 1,
          backgroundColor: "background.paper",
        }}
      >
        {isLoading ? (
          <List>
            {[...Array(3)].map((_, idx) => (
              <Fragment key={idx}>
                <ListItem>
                  <ListItemText
                    primary={<Skeleton width="50%" />}
                    secondary={<Skeleton width="30%" />}
                  />
                </ListItem>
                {idx < 2 && <Divider component="li" />}
              </Fragment>
            ))}
          </List>
        ) : foodEntries?.length === 0 ? (
          <Typography p={2} color="text.secondary">
            No food entries yet.
          </Typography>
        ) : (
          <List>
            {foodEntries?.map((entry, idx) => (
              <Fragment key={entry.id}>
                <ListItem
                  secondaryAction={
                    <Tooltip title="Edit entry">
                      <IconButton
                        edge="end"
                        onClick={() => handleEditClick(entry)}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  }
                >
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1">
                        {entry.foods?.name || "Unknown Food"}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {entry.foods?.brand ? `${entry.foods.brand}, ` : ""}
                        {entry.quantity * (entry.foods?.serving_size ?? 1)}{" "}
                        {entry.foods?.serving_unit || ""}
                      </Typography>
                    }
                  />
                </ListItem>
                {idx < foodEntries.length - 1 && <Divider component="li" />}
              </Fragment>
            ))}
          </List>
        )}
      </Paper>

      <Dialog
        open={isDialogOpen}
        onClose={() => {
          setEditedEntry(EMPTY_FOOD_ENTRY);
          setDialogOpen(false);
        }}
        title={editedEntry.id ? "Edit Food Entry" : "Add Food Entry"}
        dialogActions={
          <DialogFormActions
            onCancel={() => setDialogOpen(false)}
            onDelete={
              editedEntry.id
                ? () => handleDelete(String(editedEntry.id))
                : undefined
            }
            onSave={() => handleSave(editedEntry)}
          />
        }
      >
        <FoodEntryForm foodEntry={editedEntry} onChange={setEditedEntry} />
      </Dialog>
    </Box>
  );
};

export default FoodEntryList;
