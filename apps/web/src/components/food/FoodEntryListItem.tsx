import React from "react";
import {
  IconButton,
  Typography,
  Tooltip,
  Paper,
  Stack,
  Box,
  Chip,
  useTheme,
} from "@mui/material";
import {
  Edit,
  LocalFireDepartment,
  Restaurant,
  EmojiNature,
  FitnessCenter,
} from "@mui/icons-material";
import { FoodEntryWithFood } from "@/lib/supabase/fetch-food-entry";
import { MACRO_CHART_COLORS, UI_COLORS } from "@/constants/app";

interface FoodEntryListItemProps {
  foodEntry: FoodEntryWithFood;
  onEdit: (foodEntry: FoodEntryWithFood) => void;
}

const FoodEntryListItem: React.FC<FoodEntryListItemProps> = React.memo(
  ({ foodEntry, onEdit }) => {
    const theme = useTheme();

    const handleEdit = () => {
      onEdit(foodEntry);
    };

    const totalCalories = (foodEntry.foods?.calories ?? 0) * foodEntry.quantity;
    const totalProtein = (foodEntry.foods?.protein ?? 0) * foodEntry.quantity;
    const totalCarbs = (foodEntry.foods?.carbs ?? 0) * foodEntry.quantity;
    const totalFat = (foodEntry.foods?.fat ?? 0) * foodEntry.quantity;

    return (
      <Paper
        elevation={1}
        sx={{
          borderRadius: 2,
          background:
            theme.palette.mode === "dark"
              ? UI_COLORS.gradients.neutral.dark
              : UI_COLORS.gradients.neutral.light,
          border: `1px solid ${theme.palette.divider}`,
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: UI_COLORS.shadows.medium,
            borderColor: MACRO_CHART_COLORS.carbs,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            {/* Food Icon */}
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: `${MACRO_CHART_COLORS.carbs}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Restaurant
                sx={{ color: MACRO_CHART_COLORS.carbs, fontSize: 20 }}
              />
            </Box>

            {/* Food Details */}
            <Box flex={1}>
              <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                {foodEntry.foods?.name ?? "Unknown Food"}
              </Typography>

              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <Typography variant="body2" color="text.secondary">
                  {foodEntry.quantity} serving
                  {foodEntry.quantity > 1 ? "s" : ""}
                </Typography>
                {foodEntry.foods?.brand && (
                  <>
                    <Typography variant="body2" color="text.secondary">
                      •
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {foodEntry.foods.brand}
                    </Typography>
                  </>
                )}
              </Stack>

              {/* Macro Chips */}
              <Stack
                direction="row"
                spacing={0.5}
                flexWrap="wrap"
                sx={{ gap: 0.5 }}
              >
                <Chip
                  size="small"
                  icon={<LocalFireDepartment />}
                  label={`${totalCalories.toFixed(0)} kcal`}
                  sx={{
                    height: 20,
                    fontSize: "0.7rem",
                    backgroundColor: `${MACRO_CHART_COLORS.calories}15`,
                    color: MACRO_CHART_COLORS.calories,
                    "& .MuiChip-icon": { fontSize: 12 },
                  }}
                />
                <Chip
                  size="small"
                  icon={<Restaurant />}
                  label={`${totalCarbs.toFixed(1)}g C`}
                  sx={{
                    height: 20,
                    fontSize: "0.7rem",
                    backgroundColor: `${MACRO_CHART_COLORS.carbs}15`,
                    color: MACRO_CHART_COLORS.carbs,
                    "& .MuiChip-icon": { fontSize: 12 },
                  }}
                />
                <Chip
                  size="small"
                  icon={<EmojiNature />}
                  label={`${totalFat.toFixed(1)}g F`}
                  sx={{
                    height: 20,
                    fontSize: "0.7rem",
                    backgroundColor: `${MACRO_CHART_COLORS.fat}15`,
                    color: MACRO_CHART_COLORS.fat,
                    "& .MuiChip-icon": { fontSize: 12 },
                  }}
                />
                <Chip
                  size="small"
                  icon={<FitnessCenter />}
                  label={`${totalProtein.toFixed(1)}g P`}
                  sx={{
                    height: 20,
                    fontSize: "0.7rem",
                    backgroundColor: `${MACRO_CHART_COLORS.protein}15`,
                    color: MACRO_CHART_COLORS.protein,
                    "& .MuiChip-icon": { fontSize: 12 },
                  }}
                />
              </Stack>
            </Box>

            {/* Edit Button */}
            <Tooltip title="Edit entry" arrow>
              <IconButton
                onClick={handleEdit}
                sx={{
                  backgroundColor: `${theme.palette.primary.main}15`,
                  color: theme.palette.primary.main,
                  borderRadius: "50%", // Fully circular
                  "&:hover": {
                    backgroundColor: `${theme.palette.primary.main}25`,
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <Edit />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
      </Paper>
    );
  }
);

FoodEntryListItem.displayName = "FoodEntryListItem";

export default FoodEntryListItem;
