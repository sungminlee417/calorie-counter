/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { Fragment, useCallback, useState } from "react";
import useFormChangeDetection from "@/hooks/useFormChangeDetection";
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
  Menu,
  MenuItem,
} from "@mui/material";
import { Add } from "@mui/icons-material";

import useFoodEntries from "@/hooks/useFoodEntries";
import { FoodEntry } from "@/types/supabase";
import Dialog from "../ui/Dialog";
import FoodEntryForm from "./FoodEntryForm";
import FoodEntryListItem from "./FoodEntryListItem";
import DialogFormActions from "../ui/DialogFormActions";
import { FoodEntryWithFood } from "@/lib/supabase/fetch-food-entry";
import { useDate } from "@/context/DateContext";
import { foodEntrySchema, MealType, mealTypes } from "@/types/food-entry";
import Toast from "../ui/Toast";
import useToast from "@/hooks/useToast";
import FoodQuickAddList from "./FoodQuickAddList";

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

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openAddFromScratch, setOpenAddFromScratch] = useState(false);
  const [openQuickAdd, setOpenQuickAdd] = useState(false);

  const handleAddClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const [selectedEntry, setSelectedEntry] =
    useState<FoodEntry>(EMPTY_FOOD_ENTRY);
  const [editedEntry, setEditedEntry] = useState<FoodEntry>(EMPTY_FOOD_ENTRY);
  const [selectedMeal, setSelectedMeal] = useState<MealType>("breakfast");

  const {
    handleCloseToast,
    showToast,
    toastMessage,
    toastOpen,
    toastSeverity,
  } = useToast();

  const groupedEntries = groupByMealType(foodEntries);

  // Use change detection for the form
  const { hasChanges: formHasChanges } = useFormChangeDetection(
    selectedEntry,
    editedEntry,
    {
      ignoreKeys: ["id", "created_at", "updated_at", "user_id"],
      enableLogging: process.env.NODE_ENV === "development",
    }
  );

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
        setSelectedEntry(EMPTY_FOOD_ENTRY);
        setOpenAddFromScratch(false);
      } catch {
        showToast("Failed to save food entry.", "error");
      }
    },
    [createFoodEntry, showToast, updateFoodEntry]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteFoodEntry.mutateAsync(id);
        showToast("Food entry deleted successfully!", "success");
        setEditedEntry(EMPTY_FOOD_ENTRY);
        setSelectedEntry(EMPTY_FOOD_ENTRY);
        setOpenAddFromScratch(false);
      } catch {
        showToast("Failed to delete food entry.", "error");
      }
    },
    [deleteFoodEntry, showToast]
  );

  const handleEditClick = (entry: FoodEntry) => {
    setEditedEntry(entry);
    setSelectedEntry(entry);
    setOpenAddFromScratch(true);
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
        <Tooltip title="Add food entry">
          <IconButton onClick={handleAddClick}>
            <Add />
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem
            onClick={() => {
              setOpenAddFromScratch(true);
              handleMenuClose();
            }}
          >
            Add from scratch
          </MenuItem>
          <MenuItem
            onClick={() => {
              setOpenQuickAdd(true);
              handleMenuClose();
            }}
          >
            Add from existing foods
          </MenuItem>
        </Menu>
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
                  <FoodEntryListItem
                    foodEntry={entry as FoodEntryWithFood}
                    onEdit={handleEditClick}
                  />
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
        open={openAddFromScratch}
        onClose={() => {
          if (!isLoading) {
            setEditedEntry(EMPTY_FOOD_ENTRY);
            setSelectedEntry(EMPTY_FOOD_ENTRY);
            setOpenAddFromScratch(false);
          }
        }}
        title={`${editedEntry.id ? "Edit Food Entry" : "Add Food Entry"}${formHasChanges ? " •" : ""}`}
        dialogActions={
          <DialogFormActions
            onCancel={() => setOpenAddFromScratch(false)}
            onDelete={
              editedEntry.id
                ? () => handleDelete(String(editedEntry.id))
                : undefined
            }
            onSave={() => handleSave(editedEntry)}
            onSaveDisabled={!formHasChanges}
          />
        }
      >
        <FoodEntryForm
          foodEntry={editedEntry}
          onChange={setEditedEntry}
          selectedMeal={selectedMeal}
        />
      </Dialog>

      <Dialog
        dialogActions={
          <DialogFormActions onCancel={() => setOpenQuickAdd(false)} />
        }
        open={openQuickAdd}
        onClose={() => setOpenQuickAdd(false)}
        title="Add from existing foods"
      >
        <FoodQuickAddList mealType={selectedMeal} />
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
