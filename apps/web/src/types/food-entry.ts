import z from "zod/v4";

import { Database } from "../../supabase/types/supabase";

export type MealType =
  Database["public"]["Tables"]["food_entries"]["Row"]["meal_type"];

export const mealTypes: MealType[] = ["breakfast", "lunch", "dinner", "snacks"];

export const foodEntrySchema = z.object({
  food_id: z
    .number()
    .int()
    .min(1, "Food ID must be a positive integer")
    .describe("Unique integer identifier for the food item"),

  quantity: z
    .number()
    .positive("Quantity must be a positive number")
    .describe("Number of servings consumed"),

  meal_type: z
    .enum(mealTypes as [MealType, ...MealType[]])
    .describe("Type of meal (breakfast, lunch, dinner, snacks)"),
});
