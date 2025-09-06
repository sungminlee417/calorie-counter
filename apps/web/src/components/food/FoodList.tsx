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
import { Add, Search, Restaurant, SaveAlt } from "@mui/icons-material";

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
import useServerEnhancedFoods from "@/hooks/useServerEnhancedFoods";
import { FoodSourceType, EnhancedFood } from "@/types/food-provider";

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

  // Use enhanced foods with both internal and external providers by default
  const {
    foods: enhancedFoods,
    isLoading: isLoadingEnhanced,
    fetchNextPage: fetchNextPageEnhanced,
    hasNextPage: hasNextPageEnhanced,
    isFetchingNextPage: isFetchingNextPageEnhanced,
    saveExternalFood,
  } = useServerEnhancedFoods({
    search: debouncedSearch,
    providers: [FoodSourceType.INTERNAL, FoodSourceType.FDC_USDA],
    enableDeduplication: true,
  });

  // Fallback to client-side for internal foods (temporary debugging)
  const {
    foods: internalFoods,
    isLoading: isLoadingInternal,
    fetchNextPage: fetchNextPageInternal,
    hasNextPage: hasNextPageInternal,
    isFetchingNextPage: isFetchingNextPageInternal,
    createFood,
    deleteFood,
    updateFood,
  } = useFoods(debouncedSearch);

  // Use enhanced foods if available, otherwise fall back to internal foods converted to enhanced format
  const finalFoods =
    enhancedFoods.length > 0
      ? enhancedFoods
      : internalFoods.map((food) => ({
          ...food,
          source: FoodSourceType.INTERNAL,
          external_id: undefined,
          provider_metadata: { internalId: food.id },
          serving_size: food.serving_size || 0,
          serving_unit: food.serving_unit || "g",
          brand: food.brand || undefined,
          created_at: food.created_at || undefined,
          updated_at: food.updated_at || undefined,
        }));

  const isLoading = isLoadingEnhanced && isLoadingInternal;
  const fetchNextPage =
    enhancedFoods.length > 0 ? fetchNextPageEnhanced : fetchNextPageInternal;
  const hasNextPage =
    enhancedFoods.length > 0 ? hasNextPageEnhanced : hasNextPageInternal;
  const isFetchingNextPage =
    enhancedFoods.length > 0
      ? isFetchingNextPageEnhanced
      : isFetchingNextPageInternal;

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

  const handleSaveExternalFood = useCallback(
    async (food: EnhancedFood) => {
      const result = await handleAsyncError(
        () => saveExternalFood.mutateAsync(food),
        "handleSaveExternalFood",
        "Failed to save external food. Please try again."
      );

      if (result) {
        showToast(`"${food.name}" saved to your database!`, "success");
      }
    },
    [saveExternalFood, showToast, handleAsyncError]
  );

  const openEditDialog = (food: Food | EnhancedFood) => {
    // Only allow editing internal foods
    if ("source" in food && food.source !== FoodSourceType.INTERNAL) {
      showToast(
        "External foods cannot be edited. Save to your database first.",
        "info"
      );
      return;
    }

    // Convert food to Food type for editing
    const normalizedFood: Food =
      "source" in food
        ? {
            // Enhanced food conversion
            id: food.id || 0,
            name: food.name,
            brand: food.brand || null,
            serving_size: food.serving_size || 0,
            serving_unit: food.serving_unit || "g",
            calories: food.calories,
            protein: food.protein,
            carbs: food.carbs,
            fat: food.fat,
            created_at: food.created_at || null,
            updated_at: food.updated_at || null,
            user_id: food.user_id || "",
          }
        : food;
    setSelectedFood(normalizedFood);
    setEditedFood(normalizedFood);
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
              Enhanced Food Database
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
            placeholder="Search across all food databases..."
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
          Type to search across your personal foods and the USDA nutrition
          database
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
          ) : !finalFoods?.length ? (
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
                  {searchTerm ? "No foods found" : "Start typing to search"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchTerm
                    ? `No results for "${searchTerm}". Try a different search term.`
                    : "Search across your personal foods and the USDA nutrition database"}
                </Typography>
              </Stack>
            </Paper>
          ) : (
            <Stack spacing={1}>
              {finalFoods.map((food, idx) => (
                <Fade
                  in
                  timeout={200 + idx * 50}
                  key={`${food.source}-${food.external_id || food.id}`}
                >
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box flex={1}>
                        <FoodListItem
                          food={food}
                          onEdit={openEditDialog}
                          showSource={true}
                        />
                      </Box>
                      {food.source !== FoodSourceType.INTERNAL && (
                        <Tooltip title="Save to your database" arrow>
                          <IconButton
                            onClick={() => handleSaveExternalFood(food)}
                            disabled={saveExternalFood.isPending}
                            sx={{
                              backgroundColor: `${MACRO_CHART_COLORS.fat}15`,
                              color: MACRO_CHART_COLORS.fat,
                              "&:hover": {
                                backgroundColor: `${MACRO_CHART_COLORS.fat}25`,
                                transform: "scale(1.05)",
                              },
                              "&:disabled": {
                                opacity: 0.6,
                              },
                              transition: "all 0.2s ease-in-out",
                            }}
                          >
                            <SaveAlt />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
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
