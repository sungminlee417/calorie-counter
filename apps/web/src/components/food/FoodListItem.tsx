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
import { Food } from "@/types/supabase";
import { MACRO_CHART_COLORS, UI_COLORS } from "@/constants/app";

interface FoodListItemProps {
  food: Food;
  onEdit: (food: Food) => void;
}

const FoodListItem: React.FC<FoodListItemProps> = React.memo(
  ({ food, onEdit }) => {
    const theme = useTheme();

    const handleEdit = () => {
      onEdit(food);
    };

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
        role="listitem"
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
                {food.name}
              </Typography>

              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
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
                  label={`${food.calories} kcal`}
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
                  label={`${food.carbs}g C`}
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
                  label={`${food.fat}g F`}
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
                  label={`${food.protein}g P`}
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
            <Tooltip title="Edit food" arrow>
              <IconButton
                onClick={handleEdit}
                aria-label={`Edit ${food.name}`}
                sx={{
                  backgroundColor: `${theme.palette.primary.main}15`,
                  color: theme.palette.primary.main,
                  "&:hover": {
                    backgroundColor: `${theme.palette.primary.main}25`,
                    transform: "scale(1.1)",
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

FoodListItem.displayName = "FoodListItem";

export default FoodListItem;
