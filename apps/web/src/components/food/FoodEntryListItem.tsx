import React from "react";
import {
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Tooltip,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { FoodEntryWithFood } from "@/lib/supabase/fetch-food-entry";

interface FoodEntryListItemProps {
  foodEntry: FoodEntryWithFood;
  onEdit: (foodEntry: FoodEntryWithFood) => void;
}

const FoodEntryListItem: React.FC<FoodEntryListItemProps> = React.memo(
  ({ foodEntry, onEdit }) => {
    const handleEdit = () => {
      onEdit(foodEntry);
    };

    const totalCalories = (foodEntry.foods?.calories ?? 0) * foodEntry.quantity;
    const totalProtein = (foodEntry.foods?.protein ?? 0) * foodEntry.quantity;
    const totalCarbs = (foodEntry.foods?.carbs ?? 0) * foodEntry.quantity;
    const totalFat = (foodEntry.foods?.fat ?? 0) * foodEntry.quantity;

    return (
      <ListItem
        secondaryAction={
          <Tooltip title="Edit entry">
            <IconButton edge="end" onClick={handleEdit}>
              <Edit />
            </IconButton>
          </Tooltip>
        }
      >
        <ListItemText
          primary={
            <Typography variant="subtitle1">
              {foodEntry.foods?.name ?? "Unknown Food"} × {foodEntry.quantity}
            </Typography>
          }
          secondary={
            <Typography variant="body2" color="text.secondary">
              {`${totalCalories.toFixed(1)} kcal | C: ${totalCarbs.toFixed(1)}g | F: ${totalFat.toFixed(1)}g | P: ${totalProtein.toFixed(1)}g`}
            </Typography>
          }
        />
      </ListItem>
    );
  }
);

FoodEntryListItem.displayName = "FoodEntryListItem";

export default FoodEntryListItem;
