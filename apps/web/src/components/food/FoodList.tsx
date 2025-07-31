"use client";

import React, { Fragment, useCallback, useState } from "react";
import useFormChangeDetection from "@/hooks/useFormChangeDetection";
import {
  Typography,
  Box,
  Stack,
  IconButton,
  Skeleton,
  Paper,
  Tooltip,
  CircularProgress,
  TextField,
  useTheme,
  Fade,
  InputAdornment,
} from "@mui/material";
import { Add, Search, Restaurant } from "@mui/icons-material";

import useFoods from "@/hooks/useFoods";
import useUser from "@/hooks/useUser";
import useDebounce from "@/hooks/useDebounce";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { Food } from "@/types/supabase";
import { foodSchema } from "@/types/food";
import {
  SEARCH_DEBOUNCE_DELAY,
  MACRO_CHART_COLORS,
  UI_COLORS,
} from "@/constants/app";

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
  const theme = useTheme();
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
            background: `linear-gradient(90deg, ${MACRO_CHART_COLORS.carbs}15, ${MACRO_CHART_COLORS.fat}15)`,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
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
              Food Database
            </Typography>
            <Tooltip title="Add new food" arrow>
              <IconButton
                onClick={() => setIsFoodDialogOpen(true)}
                aria-label="Add new food"
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

          {/* Search input */}
          <TextField
            fullWidth
            size="small"
            placeholder="Search your food database..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: MACRO_CHART_COLORS.carbs }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(255,255,255,0.8)",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: MACRO_CHART_COLORS.carbs,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: MACRO_CHART_COLORS.carbs,
                },
              },
            }}
            inputProps={{
              "aria-label": "Search foods",
              "aria-describedby": "search-foods-description",
            }}
          />
        </Box>

        <Box
          id="search-foods-description"
          sx={{ sr: "only", position: "absolute", left: "-10000px" }}
        >
          Type to search through your food database
        </Box>

        {/* Content Area */}
        <Box
          sx={{
            maxHeight: 400,
            overflowY: "auto",
            p: 2,
          }}
          role="region"
          aria-label="Foods list"
        >
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
                        <Skeleton width="80%" height={20} sx={{ mt: 0.5 }} />
                      </Box>
                      <Skeleton variant="rectangular" width={24} height={24} />
                    </Stack>
                  </Paper>
                </Fade>
              ))}
            </Stack>
          ) : !foods?.length ? (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 2,
                background: `${MACRO_CHART_COLORS.carbs}08`,
                border: `1px dashed ${MACRO_CHART_COLORS.carbs}44`,
              }}
            >
              <Stack alignItems="center" spacing={2}>
                <Box sx={{ color: MACRO_CHART_COLORS.carbs, fontSize: 48 }}>
                  <Restaurant />
                </Box>
                <Typography variant="h6" color="text.secondary">
                  {searchTerm ? "No foods found" : "No foods in database"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchTerm
                    ? `No results for "${searchTerm}". Try a different search term.`
                    : "Add your first food item to get started!"}
                </Typography>
              </Stack>
            </Paper>
          ) : (
            <Stack spacing={1}>
              {foods.map((food, idx) => (
                <Fade in timeout={200 + idx * 50} key={food.id}>
                  <Box>
                    <FoodListItem food={food} onEdit={openEditDialog} />
                  </Box>
                </Fade>
              ))}
              {isFetchingNextPage && (
                <Box display="flex" justifyContent="center" py={2}>
                  <CircularProgress
                    size={24}
                    sx={{ color: MACRO_CHART_COLORS.carbs }}
                  />
                </Box>
              )}
              {hasNextPage && <div ref={bottomRef} />}
            </Stack>
          )}
        </Box>
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
    </Fragment>
  );
};

export default FoodList;
