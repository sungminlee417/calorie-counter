import React, { Fragment, useCallback } from "react";
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import { Add } from "@mui/icons-material";

import useFoodEntries from "@/hooks/useFoodEntries";
import { FoodEntryWithFood } from "@/lib/supabase/fetch-food-entry";
import { FoodEntry } from "@/types/supabase";
import { foodEntrySchema, MealType } from "@/types/food-entry";
import useToast from "@/hooks/useToast";
import Toast from "../ui/Toast";

export interface FoodQuickAddListProps {
  mealType: MealType;
}

const FoodQuickAddList: React.FC<FoodQuickAddListProps> = ({ mealType }) => {
  const { createFoodEntry, foodEntries, isLoading } = useFoodEntries();

  const {
    handleCloseToast,
    showToast,
    toastMessage,
    toastOpen,
    toastSeverity,
  } = useToast();

  const handleDuplicate = useCallback(
    async (foodEntry: FoodEntryWithFood) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { created_at, foods, updated_at, id, ...rest } = foodEntry;

      const result = foodEntrySchema.safeParse({
        ...rest,
        meal_type: mealType,
      });
      if (!result.success) {
        showToast("Invalid food entry data. Please check your input.", "error");
        return;
      }

      try {
        await createFoodEntry.mutateAsync({
          ...rest,
          meal_type: mealType,
        } as Omit<FoodEntry, "id" | "created_at" | "updated_at">);
        showToast("Food entry created successfully!", "success");
      } catch {
        showToast("Failed to save food entry.", "error");
      }
    },
    [createFoodEntry, mealType, showToast]
  );

  return (
    <Paper
      variant="outlined"
      sx={{ borderRadius: 2, backgroundColor: "background.paper" }}
    >
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
        ) : !foodEntries?.length ? null : (
          <List>
            {foodEntries.map((entry, idx) => (
              <Fragment key={entry.id}>
                <ListItem
                  secondaryAction={
                    <Tooltip title="Add entry">
                      <IconButton
                        edge="end"
                        onClick={() => handleDuplicate(entry)}
                      >
                        <Add />
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
                        {(entry as FoodEntryWithFood).foods?.serving_unit || ""}
                      </Typography>
                    }
                  />
                </ListItem>
                {idx < foodEntries.length - 1 && <Divider component="li" />}
              </Fragment>
            ))}
          </List>
        )}
      </Box>

      <Toast
        handleCloseToast={handleCloseToast}
        toastOpen={toastOpen}
        toastSeverity={toastSeverity}
      >
        {toastMessage}
      </Toast>
    </Paper>
  );
};

export default FoodQuickAddList;
