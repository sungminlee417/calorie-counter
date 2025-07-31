"use client";

import React, { Fragment, useCallback, useState } from "react";
import useFormChangeDetection from "@/hooks/useFormChangeDetection";
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
  CircularProgress,
  TextField,
} from "@mui/material";
import { Add } from "@mui/icons-material";

import useFoods from "@/hooks/useFoods";
import useUser from "@/hooks/useUser";
import useDebounce from "@/hooks/useDebounce";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { Food } from "@/types/supabase";
import { foodSchema } from "@/types/food";
import { SEARCH_DEBOUNCE_DELAY } from "@/constants/app";

import Dialog from "../ui/Dialog";
import FoodForm from "./FoodForm";
import FoodListItem from "./FoodListItem";
import DialogFormActions from "../ui/DialogFormActions";
import Toast from "../ui/Toast";
import useToast from "@/hooks/useToast";
import useErrorHandler from "@/hooks/useErrorHandler";

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

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm.trim(), SEARCH_DEBOUNCE_DELAY);

  const {
    createFood,
    deleteFood,
    foods,
    updateFood,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFoods(debouncedSearch);

  const [isFoodDialogOpen, setIsFoodDialogOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food>(EMPTY_FOOD);
  const [editedFood, setEditedFood] = useState<Food>(EMPTY_FOOD);

  const {
    handleCloseToast,
    showToast,
    toastMessage,
    toastOpen,
    toastSeverity,
  } = useToast();

  const { handleAsyncError } = useErrorHandler();

  // Use change detection for the form
  const { hasChanges: formHasChanges } = useFormChangeDetection(
    selectedFood,
    editedFood,
    {
      ignoreKeys: ["id", "created_at", "updated_at", "user_id"],
      enableLogging: process.env.NODE_ENV === "development",
    }
  );

  const handleSaveFood = useCallback(
    async (food: Food) => {
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

      const validationResult = foodSchema.safeParse(food);
      if (!validationResult.success) {
        showToast("Invalid food data. Please check your input.", "error");
        return;
      }

      const result = await handleAsyncError(
        async () => {
          if (food.id) {
            await updateFood.mutateAsync(food);
            return "updated";
          } else {
            await createFood.mutateAsync(foodToSave);
            return "created";
          }
        },
        "handleSaveFood",
        "Failed to save food. Please try again."
      );

      if (result) {
        const action = result === "updated" ? "updated" : "created";
        showToast(`Food ${action} successfully!`, "success");
        setSelectedFood(EMPTY_FOOD);
        setEditedFood(EMPTY_FOOD);
        setIsFoodDialogOpen(false);
      }
    },
    [createFood, showToast, updateFood, handleAsyncError]
  );

  const handleDeleteFood = useCallback(
    async (foodId: string) => {
      const result = await handleAsyncError(
        () => deleteFood.mutateAsync(foodId),
        "handleDeleteFood",
        "Failed to delete food. Please try again."
      );

      if (result) {
        showToast("Food deleted successfully!", "success");
        setSelectedFood(EMPTY_FOOD);
        setEditedFood(EMPTY_FOOD);
        setIsFoodDialogOpen(false);
      }
    },
    [deleteFood, showToast, handleAsyncError]
  );

  const openEditDialog = (food: Food) => {
    setSelectedFood(food);
    setEditedFood(food);
    setIsFoodDialogOpen(true);
  };

  const bottomRef = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  return (
    <Box>
      <Stack direction="row" alignItems="center" mb={2} spacing={2}>
        <Typography variant="h6" flex={1}>
          Foods
        </Typography>

        {/* Search input */}
        <TextField
          size="small"
          placeholder="Search foods"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 250, mr: 2 }}
          inputProps={{
            "aria-label": "Search foods",
            "aria-describedby": "search-foods-description",
          }}
        />

        <Tooltip title="Add new food">
          <IconButton
            onClick={() => setIsFoodDialogOpen(true)}
            aria-label="Add new food"
          >
            <Add />
          </IconButton>
        </Tooltip>
      </Stack>

      <Box
        id="search-foods-description"
        sx={{ sr: "only", position: "absolute", left: "-10000px" }}
      >
        Type to search through your food database
      </Box>

      <Paper
        variant="outlined"
        sx={{
          maxHeight: 320,
          overflowY: "auto",
          borderRadius: 2,
          px: 1,
          backgroundColor: "background.paper",
        }}
        role="region"
        aria-label="Foods list"
      >
        {isLoading ? (
          <List>
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
          <List>
            {foods.map((food, idx) => (
              <Fragment key={food.id}>
                <FoodListItem food={food} onEdit={openEditDialog} />
                {idx < foods.length - 1 && <Divider component="li" />}
              </Fragment>
            ))}
            {isFetchingNextPage && (
              <Box display="flex" justifyContent="center" py={2}>
                <CircularProgress size={24} />
              </Box>
            )}
            {hasNextPage && <div ref={bottomRef} />}
          </List>
        )}
      </Paper>

      <Dialog
        open={isFoodDialogOpen}
        onClose={() => {
          if (!isLoading) {
            setEditedFood(EMPTY_FOOD);
            setIsFoodDialogOpen(false);
          }
        }}
        title={`${editedFood.id ? "Edit Food" : "Add Food"}${formHasChanges ? " •" : ""}`}
        aria-describedby="food-dialog-description"
        dialogActions={
          <DialogFormActions
            onCancel={() => setIsFoodDialogOpen(false)}
            onDelete={
              editedFood.id && editedFood.user_id === user?.id
                ? () => handleDeleteFood(String(editedFood.id))
                : undefined
            }
            onSave={
              editedFood.id
                ? editedFood.user_id === user?.id
                  ? () => handleSaveFood(editedFood)
                  : undefined
                : () => handleSaveFood(editedFood)
            }
            onSaveDisabled={!formHasChanges}
          />
        }
      >
        <Box
          id="food-dialog-description"
          sx={{ mb: 2, color: "text.secondary" }}
        >
          {editedFood.id
            ? "Edit the nutritional information for this food item"
            : "Add nutritional information for a new food item"}
        </Box>
        <FoodForm
          food={editedFood}
          onChange={(updatedFood) => setEditedFood(updatedFood)}
        />
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

export default FoodList;
