import z from "zod/v4";

export const foodEntrySchema = z.object({
  food_id: z
    .number()
    .int()
    .min(1, "Food ID must be a positive integer")
    .describe(
      "Unique integer identifier for the food item, referencing the food database record"
    ),

  quantity: z
    .number()
    .positive("Quantity must be a positive number")
    .describe(
      "The number of servings consumed, e.g., 1.5 for one and a half servings. Used as a multiplier against the food's nutritional values"
    ),
});
