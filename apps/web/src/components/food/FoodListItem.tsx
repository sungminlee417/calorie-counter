import React from "react";
import {
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Tooltip,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { Food } from "@/types/supabase";

interface FoodListItemProps {
  food: Food;
  onEdit: (food: Food) => void;
}

const FoodListItem: React.FC<FoodListItemProps> = React.memo(
  ({ food, onEdit }) => {
    const handleEdit = () => {
      onEdit(food);
    };

    return (
      <ListItem
        secondaryAction={
          <Tooltip title="Edit food">
            <IconButton
              edge="end"
              onClick={handleEdit}
              aria-label={`Edit ${food.name}`}
            >
              <Edit />
            </IconButton>
          </Tooltip>
        }
        role="listitem"
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
    );
  }
);

FoodListItem.displayName = "FoodListItem";

export default FoodListItem;
