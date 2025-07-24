"use client";

import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
import { Add, Edit } from "@mui/icons-material";

import useFoods from "@/hooks/useFoods";
import useUser from "@/hooks/useUser";
import { Food } from "@/types/supabase";
import { foodSchema } from "@/types/food";

import Dialog from "../ui/Dialog";
import FoodForm from "./FoodForm";
import DialogFormActions from "../ui/DialogFormActions";
import Toast from "../ui/Toast";

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
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

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
  const [editedFood, setEditedFood] = useState<Food>(EMPTY_FOOD);

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

      const result = foodSchema.safeParse(food);
      if (!result.success) {
        showToast("Invalid food data. Please check your input.", "error");
        return;
      }

      try {
        if (food.id) {
          await updateFood.mutateAsync(food);
          showToast("Food updated successfully!", "success");
        } else {
          await createFood.mutateAsync(foodToSave);
          showToast("Food created successfully!", "success");
        }
        setEditedFood(EMPTY_FOOD);
        setIsFoodDialogOpen(false);
      } catch {
        showToast("Failed to save food.", "error");
      }
    },
    [createFood, updateFood]
  );

  const handleDeleteFood = useCallback(
    async (foodId: string) => {
      try {
        await deleteFood.mutateAsync(foodId);
        showToast("Food deleted successfully!", "success");
        setEditedFood(EMPTY_FOOD);
        setIsFoodDialogOpen(false);
      } catch {
        showToast("Failed to delete food.", "error");
      }
    },
    [deleteFood]
  );

  const openEditDialog = (food: Food) => {
    setEditedFood(food);
    setIsFoodDialogOpen(true);
  };

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const el = bottomRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <Box>
      <Stack direction="row" alignItems="center" mb={2} spacing={2}>
        <Typography variant="h6" flex={1}>
          Foods
        </Typography>

        <TextField
          size="small"
          placeholder="Search foods"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 250, mr: 2 }}
        />

        <Tooltip title="Add new food">
          <IconButton onClick={() => setIsFoodDialogOpen(true)}>
            <Add />
          </IconButton>
        </Tooltip>
      </Stack>

      <Paper
        variant="outlined"
        sx={{
          maxHeight: 320,
          overflowY: "auto",
          borderRadius: 2,
          px: 1,
          backgroundColor: "background.paper",
        }}
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
                <ListItem
                  secondaryAction={
                    <Tooltip title="Edit food">
                      <IconButton
                        edge="end"
                        onClick={() => openEditDialog(food)}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  }
                >
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1">
                        {food.name}
                        {food.brand ? ` (${food.brand})` : ""}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {`Calories: ${food.calories} kcal | Carbs: ${food.carbs}g | Fat: ${food.fat}g | Protein: ${food.protein}g`}
                      </Typography>
                    }
                  />
                </ListItem>
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
        title={editedFood.id ? "Edit Food" : "Add Food"}
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
          />
        }
      >
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
