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
  useTheme,
  Fade,
  Chip,
} from "@mui/material";
import {
  Add,
  LocalFireDepartment,
  Restaurant,
  EmojiNature,
  FitnessCenter,
  AccessTime,
} from "@mui/icons-material";

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
import { MACRO_CHART_COLORS, UI_COLORS } from "@/constants/app";

const EMPTY_FOOD_ENTRY: FoodEntry = {
  id: 0,
  user_id: "",
  food_id: 0,
  quantity: 1,
  created_at: null,
  updated_at: null,
  meal_type: "breakfast",
};

const getMealTypeInfo = (meal: MealType) => {
  switch (meal) {
    case "breakfast":
      return {
        icon: <LocalFireDepartment />,
        color: MACRO_CHART_COLORS.calories,
        label: "Breakfast",
        emoji: "🍳",
      };
    case "lunch":
      return {
        icon: <Restaurant />,
        color: MACRO_CHART_COLORS.carbs,
        label: "Lunch",
        emoji: "🥪",
      };
    case "dinner":
      return {
        icon: <EmojiNature />,
        color: MACRO_CHART_COLORS.fat,
        label: "Dinner",
        emoji: "🍽️",
      };
    case "snacks":
      return {
        icon: <FitnessCenter />,
        color: MACRO_CHART_COLORS.protein,
        label: "Snacks",
        emoji: "🍎",
      };
    default:
      return {
        icon: <AccessTime />,
        color: "#666",
        label: meal,
        emoji: "⏰",
      };
  }
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
  const theme = useTheme();
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
    <Fragment>
      <Paper
        elevation={2}
        sx={{
          borderRadius: 3,
          background:
            theme.palette.mode === "dark"
              ? UI_COLORS.gradients.neutral.dark
              : UI_COLORS.gradients.neutral.light,
          border: `1px solid ${theme.palette.divider}`,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 3,
            borderBottom: `1px solid ${theme.palette.divider}`,
            background: `linear-gradient(90deg, ${MACRO_CHART_COLORS.calories}15, ${MACRO_CHART_COLORS.carbs}15, ${MACRO_CHART_COLORS.fat}15, ${MACRO_CHART_COLORS.protein}15)`,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Restaurant
              sx={{ color: MACRO_CHART_COLORS.carbs, fontSize: 28 }}
            />
            <Typography
              variant="h5"
              fontWeight="600"
              sx={{
                flex: 1,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Daily Food Entries
            </Typography>
            <Tooltip title="Add food entry" arrow>
              <IconButton
                onClick={handleAddClick}
                sx={{
                  backgroundColor: `${theme.palette.primary.main}15`,
                  color: theme.palette.primary.main,
                  "&:hover": {
                    backgroundColor: `${theme.palette.primary.main}25`,
                    transform: "scale(1.05)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <Add />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              borderRadius: 2,
              mt: 1,
              boxShadow: UI_COLORS.shadows.medium,
            },
          }}
        >
          <MenuItem
            onClick={() => {
              setOpenAddFromScratch(true);
              handleMenuClose();
            }}
            sx={{
              gap: 1,
              "&:hover": {
                backgroundColor: `${MACRO_CHART_COLORS.carbs}15`,
              },
            }}
          >
            <Add sx={{ color: MACRO_CHART_COLORS.carbs }} />
            Add from scratch
          </MenuItem>
          <MenuItem
            onClick={() => {
              setOpenQuickAdd(true);
              handleMenuClose();
            }}
            sx={{
              gap: 1,
              "&:hover": {
                backgroundColor: `${MACRO_CHART_COLORS.protein}15`,
              },
            }}
          >
            <FitnessCenter sx={{ color: MACRO_CHART_COLORS.protein }} />
            Add from existing foods
          </MenuItem>
        </Menu>

        {/* Meal Tabs */}
        <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Tabs
            value={selectedMeal}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons={true}
            allowScrollButtonsMobile
            sx={{
              "& .MuiTab-root": {
                borderRadius: 2,
                margin: 0.5,
                minHeight: 48,
                textTransform: "none",
                fontWeight: 500,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "action.hover",
                  transform: "translateY(-1px)",
                },
                "&.Mui-selected": {
                  backgroundColor: `${getMealTypeInfo(selectedMeal).color}15`,
                  color: getMealTypeInfo(selectedMeal).color,
                },
              },
            }}
          >
            {mealTypes.map((meal) => {
              const mealInfo = getMealTypeInfo(meal);
              return (
                <Tab
                  key={meal}
                  label={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Box sx={{ color: mealInfo.color }}>{mealInfo.icon}</Box>
                      <Box>
                        <Typography variant="body2" fontWeight="inherit">
                          {mealInfo.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {groupedEntries[meal].length} item
                          {groupedEntries[meal].length !== 1 ? "s" : ""}
                        </Typography>
                      </Box>
                    </Stack>
                  }
                  value={meal}
                />
              );
            })}
          </Tabs>
        </Box>

        {/* Content Area */}
        <Box sx={{ maxHeight: 400, overflowY: "auto", p: 2 }}>
          {isLoading ? (
            <Stack spacing={2}>
              {[...Array(4)].map((_, idx) => (
                <Fade in timeout={300 + idx * 100} key={idx}>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background:
                        theme.palette.mode === "dark" ? "#2a2a2a" : "#ffffff",
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Skeleton variant="circular" width={40} height={40} />
                      <Box flex={1}>
                        <Skeleton width="60%" height={24} />
                        <Skeleton width="40%" height={20} sx={{ mt: 0.5 }} />
                      </Box>
                      <Stack spacing={1}>
                        <Skeleton width={60} height={20} />
                        <Skeleton width={80} height={20} />
                      </Stack>
                    </Stack>
                  </Paper>
                </Fade>
              ))}
            </Stack>
          ) : groupedEntries[selectedMeal].length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 2,
                background: `${getMealTypeInfo(selectedMeal).color}08`,
                border: `1px dashed ${getMealTypeInfo(selectedMeal).color}44`,
              }}
            >
              <Stack alignItems="center" spacing={2}>
                <Box
                  sx={{
                    color: getMealTypeInfo(selectedMeal).color,
                    fontSize: 48,
                  }}
                >
                  {getMealTypeInfo(selectedMeal).icon}
                </Box>
                <Typography variant="h6" color="text.secondary">
                  No {selectedMeal} entries yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Add your first {selectedMeal} item to get started!
                </Typography>
              </Stack>
            </Paper>
          ) : (
            <Stack spacing={1}>
              {groupedEntries[selectedMeal].map((entry, idx) => (
                <Fade in timeout={200 + idx * 50} key={entry.id}>
                  <Box>
                    <FoodEntryListItem
                      foodEntry={entry as FoodEntryWithFood}
                      onEdit={handleEditClick}
                    />
                  </Box>
                </Fade>
              ))}
            </Stack>
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
    </Fragment>
  );
};

export default FoodEntryList;
