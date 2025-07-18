import z from "zod/v4";

export const foodEntrySchema = z.object({
  food_id: z
    .number()
    .min(1, "Food ID cannot be empty")
    .describe("Unique identifier for the food item from the database"),

  quantity: z
    .number()
    .positive("Servings must be a positive number")
    .describe("Number of servings consumed for the given food item"),
});
