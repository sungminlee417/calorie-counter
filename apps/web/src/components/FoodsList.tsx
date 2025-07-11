"use client";

import React, { useState } from "react";
import {
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
} from "@mui/material";
import useFoods from "@/hooks/useFoods";

const FoodList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { foods } = useFoods();

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Foods
      </Typography>

      <TextField
        fullWidth
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for a specific food..."
        value={searchTerm}
        sx={{ mb: 2 }}
      />

      <Box
        sx={{
          maxHeight: 300,
          overflowY: "auto",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
        }}
      >
        {foods?.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ p: 2, textAlign: "center" }}
          >
            No foods found.
          </Typography>
        ) : (
          <List disablePadding>
            {foods?.map((food, idx) => (
              <React.Fragment key={food.id}>
                <ListItem>
                  <ListItemText
                    primary={food.name}
                    secondary={`Calories: ${food.calories} | Carbs: ${food.carbs}g | Fats: ${food.fat}g | Protein: ${food.protein}g`}
                  />
                </ListItem>
                {idx < foods.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default FoodList;
