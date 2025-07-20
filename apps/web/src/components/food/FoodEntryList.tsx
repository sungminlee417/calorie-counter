/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { Fragment, useCallback, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Skeleton,
  Paper,
  Tooltip,
  Tabs,
  Tab,
} from "@mui/material";
import { Add, Edit } from "@mui/icons-material";

import useFoodEntries from "@/hooks/useFoodEntries";
import { FoodEntry } from "@/types/supabase";
import Dialog from "../ui/Dialog";
import FoodEntryForm from "./FoodEntryForm";
import DialogFormActions from "../ui/DialogFormActions";
import { FoodEntryWithFood } from "@/lib/supabase/fetch-food-entry";
import { useDate } from "@/context/DateContext";
import { foodEntrySchema, MealType, mealTypes } from "@/types/food-entry";
import Toast from "../ui/Toast";

const EMPTY_FOOD_ENTRY: FoodEntry = {
  id: 0,
  user_id: "",
  food_id: 0,
  quantity: 1,
  created_at: null,
  updated_at: null,
  meal_type: "breakfast",
};

const mealIcons: Record<MealType, string> = {
  breakfast: "🍳",
  lunch: "🥪",
  dinner: "🍽️",
  snacks: "🍎",
};

const groupByMealType = (
  entries: (FoodEntryWithFood | FoodEntry)[] | undefined
): Record<MealType, (FoodEntryWithFood | FoodEntry)[]> => {
  return (
    entries?.reduce(
      (acc, entry) => {
        const mealType = (entry as FoodEntryWithFood).meal_type ?? "snacks";
        if (mealTypes.includes(mealType as MealType)) {
          acc[mealType as MealType].push(entry);
        } else {
          acc.snacks.push(entry);
        }
        return acc;
      },
      {
        breakfast: [],
        lunch: [],
        dinner: [],
        snacks: [],
      } as Record<MealType, (FoodEntryWithFood | FoodEntry)[]>
    ) ?? {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: [],
    }
  );
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
  const [selectedMeal, setSelectedMeal] = useState<MealType>("breakfast");

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");

  const showToast = (
    message: string,
    severity: "success" | "error" | "info" | "warning" = "success"
  ) => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  const handleCloseToast = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setToastOpen(false);
  };

  const groupedEntries = groupByMealType(foodEntries);

  const handleSave = useCallback(
    async (foodEntry: FoodEntry | FoodEntryWithFood) => {
      const { created_at, updated_at, id, ...rest } = foodEntry;

      const result = foodEntrySchema.safeParse(rest);
      if (!result.success) {
        showToast("Invalid food entry data. Please check your input.", "error");
        return;
      }

      let cleanedEntry: Partial<FoodEntry>;

      if ("foods" in foodEntry) {
        const { foods, ...rest } = foodEntry;
        cleanedEntry = rest;
      } else {
        cleanedEntry = rest;
      }

      try {
        if (foodEntry.id) {
          await updateFoodEntry.mutateAsync(
            cleanedEntry as Omit<FoodEntry, "created_at" | "updated_at">
          );
          showToast("Food entry updated successfully!", "success");
        } else {
          await createFoodEntry.mutateAsync(
            cleanedEntry as Omit<FoodEntry, "id" | "created_at" | "updated_at">
          );
          showToast("Food entry created successfully!", "success");
        }
        setEditedEntry(EMPTY_FOOD_ENTRY);
        setDialogOpen(false);
      } catch {
        showToast("Failed to save food entry.", "error");
      }
    },
    [createFoodEntry, updateFoodEntry]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteFoodEntry.mutateAsync(id);
        showToast("Food entry deleted successfully!", "success");
        setEditedEntry(EMPTY_FOOD_ENTRY);
        setDialogOpen(false);
      } catch {
        showToast("Failed to delete food entry.", "error");
      }
    },
    [deleteFoodEntry]
  );

  const handleEditClick = (entry: FoodEntry) => {
    setEditedEntry(entry);
    setDialogOpen(true);
  };

  const handleTabChange = (_: React.SyntheticEvent, newMeal: MealType) => {
    setSelectedMeal(newMeal);
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
        sx={{ borderRadius: 2, backgroundColor: "background.paper" }}
      >
        <Tabs
          value={selectedMeal}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons={true}
          allowScrollButtonsMobile
          sx={{ px: 2, pt: 1 }}
        >
          {mealTypes.map((meal) => (
            <Tab
              key={meal}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <span>{mealIcons[meal]}</span>
                  <span style={{ textTransform: "capitalize" }}>{meal}</span>
                </Box>
              }
              value={meal}
            />
          ))}
        </Tabs>

        <Box sx={{ maxHeight: 320, overflowY: "auto", px: 1 }}>
          {isLoading ? (
            <List>
              {[...Array(4)].map((_, idx) => (
                <Fragment key={idx}>
                  <ListItem>
                    <ListItemText
                      primary={<Skeleton width="50%" />}
                      secondary={<Skeleton width="30%" />}
                    />
                  </ListItem>
                  {idx < 3 && <Divider component="li" />}
                </Fragment>
              ))}
            </List>
          ) : groupedEntries[selectedMeal].length === 0 ? (
            <Typography p={2} color="text.secondary" fontStyle="italic">
              No {selectedMeal} entries yet.
            </Typography>
          ) : (
            <List>
              {groupedEntries[selectedMeal].map((entry, idx) => (
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
                        <Typography variant="subtitle1" fontWeight="medium">
                          {(entry as FoodEntryWithFood).foods?.name ||
                            "Unknown Food"}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {(entry as FoodEntryWithFood).foods?.brand
                            ? `${(entry as FoodEntryWithFood).foods.brand}, `
                            : ""}
                          {entry.quantity *
                            ((entry as FoodEntryWithFood).foods?.serving_size ??
                              1)}{" "}
                          {(entry as FoodEntryWithFood).foods?.serving_unit ||
                            ""}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {idx < groupedEntries[selectedMeal].length - 1 && (
                    <Divider component="li" />
                  )}
                </Fragment>
              ))}
            </List>
          )}
        </Box>
      </Paper>

      <Dialog
        open={isDialogOpen}
        onClose={() => {
          if (!isLoading) {
            setEditedEntry(EMPTY_FOOD_ENTRY);
            setDialogOpen(false);
          }
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

      <Toast
        handleCloseToast={handleCloseToast}
        toastOpen={toastOpen}
        toastSeverity={toastSeverity}
      >
        {toastMessage}
      </Toast>
    </Box>
  );
};

export default FoodEntryList;
