import React, { useState } from "react";
import {
  Typography,
  Tooltip,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  ListItem,
  MediumStack,
  SmallStack,
  ActionButton,
  IconContainer,
} from "@/components/styled";
import {
  Edit,
  Restaurant,
  Add,
  WbSunny,
  LunchDining,
  DinnerDining,
  Cookie,
} from "@mui/icons-material";
import { Food, FoodSourceType } from "@/types/food-provider";
import { MACRO_CHART_COLORS } from "@/constants/app";
import FoodSourceBadge from "./FoodSourceBadge";
import { MealType } from "@/types/food-entry";

interface FoodListItemProps {
  food: Food;
  onEdit: (food: Food) => void;
  onAddEntry?: (food: Food, mealType: MealType) => void;
  showSource?: boolean;
}

const mealOptions = [
  { value: "breakfast" as MealType, label: "Breakfast", icon: <WbSunny /> },
  { value: "lunch" as MealType, label: "Lunch", icon: <LunchDining /> },
  { value: "dinner" as MealType, label: "Dinner", icon: <DinnerDining /> },
  { value: "snacks" as MealType, label: "Snacks", icon: <Cookie /> },
];

const FoodListItem: React.FC<FoodListItemProps> = React.memo(
  ({ food, onEdit, onAddEntry, showSource = false }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleEdit = () => {
      onEdit(food);
    };

    const handleAddClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleMealSelect = (mealType: MealType) => {
      onAddEntry?.(food, mealType);
      setAnchorEl(null);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
      <ListItem elevation={1} role="listitem" sx={{ p: 2.5 }}>
        <Box>
          <MediumStack direction="row" alignItems="center" spacing={2}>
            {/* Food Icon */}
            <IconContainer
              sx={{
                background: `${MACRO_CHART_COLORS.carbs}15`,
                width: 36,
                height: 36,
              }}
            >
              <Restaurant
                sx={{ color: MACRO_CHART_COLORS.carbs, fontSize: 18 }}
              />
            </IconContainer>

            {/* Food Details */}
            <Box flex={1}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1,
                  mb: 0.5,
                  flexWrap: "wrap",
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight="600"
                  sx={{
                    wordBreak: "break-word",
                    lineHeight: 1.3,
                    flex: "1 1 auto",
                    minWidth: 0,
                  }}
                >
                  {food.name}
                </Typography>
                {showSource && "source" in food && (
                  <FoodSourceBadge
                    source={food.source as FoodSourceType}
                    size="small"
                  />
                )}
              </Box>

              <SmallStack direction="row" alignItems="center" mb={0.5}>
                <Typography variant="body2" color="text.secondary">
                  {food.serving_size} {food.serving_unit}
                </Typography>
                {food.brand && (
                  <>
                    <Typography variant="body2" color="text.secondary">
                      •
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {food.brand}
                    </Typography>
                  </>
                )}
              </SmallStack>

              {/* Simplified Macro Display */}
              <Typography variant="caption" color="text.secondary">
                <Box
                  component="span"
                  sx={{ color: MACRO_CHART_COLORS.calories, fontWeight: 500 }}
                >
                  {food.calories} kcal
                </Box>
                {" • "}
                <Box
                  component="span"
                  sx={{ color: MACRO_CHART_COLORS.protein }}
                >
                  P: {food.protein}g
                </Box>
                {" • "}
                <Box component="span" sx={{ color: MACRO_CHART_COLORS.carbs }}>
                  C: {food.carbs}g
                </Box>
                {" • "}
                <Box component="span" sx={{ color: MACRO_CHART_COLORS.fat }}>
                  F: {food.fat}g
                </Box>
              </Typography>
            </Box>

            {/* Simplified Action Buttons */}
            <SmallStack direction="row" spacing={0.5}>
              {onAddEntry && (
                <>
                  <Tooltip title="Add to meal" arrow>
                    <ActionButton
                      onClick={handleAddClick}
                      aria-label={`Add ${food.name} to entries`}
                      sx={{
                        width: 32,
                        height: 32,
                        minWidth: 32,
                        borderRadius: "50%", // Fully circular
                        "& svg": { fontSize: 18 },
                      }}
                    >
                      <Add />
                    </ActionButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >
                    {mealOptions.map((option) => (
                      <MenuItem
                        key={option.value}
                        onClick={() => handleMealSelect(option.value)}
                        sx={{ py: 1 }}
                      >
                        <ListItemIcon
                          sx={{ minWidth: 36, color: MACRO_CHART_COLORS.carbs }}
                        >
                          {option.icon}
                        </ListItemIcon>
                        <ListItemText primary={option.label} />
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              )}
              <Tooltip title="Edit" arrow>
                <ActionButton
                  onClick={handleEdit}
                  aria-label={`Edit ${food.name}`}
                  sx={{
                    width: 32,
                    height: 32,
                    minWidth: 32,
                    borderRadius: "50%", // Fully circular
                    "& svg": { fontSize: 18 },
                  }}
                >
                  <Edit />
                </ActionButton>
              </Tooltip>
            </SmallStack>
          </MediumStack>
        </Box>
      </ListItem>
    );
  }
);

FoodListItem.displayName = "FoodListItem";

export default FoodListItem;
