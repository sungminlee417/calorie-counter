import z from "zod/v4";

export const foodSchema = z.object({
  name: z
    .string()
    .min(1)
    .describe(
      "The common name or title of the food item, e.g., 'Banana' or 'Peanut Butter'"
    ),
  brand: z
    .string()
    .optional()
    .describe(
      "The manufacturer or brand name associated with the food item, e.g., 'Dole', 'Skippy'"
    ),
  serving_size: z
    .number()
    .positive()
    .describe(
      "The numeric value of a single serving, e.g., 100 for 100g. Used with 'serving_unit'."
    ),
  serving_unit: z
    .string()
    .min(1)
    .describe(
      "The unit of measurement for the serving size, such as 'g' (grams), 'oz' (ounces), or 'cup'"
    ),
  calories: z
    .number()
    .nonnegative()
    .describe("Energy content in one serving, measured in kilocalories (kcal)"),
  protein: z
    .number()
    .nonnegative()
    .describe("Protein content in one serving, in grams (g)"),
  carbs: z
    .number()
    .nonnegative()
    .describe(
      "Total carbohydrates in one serving, in grams (g), including sugars and fiber"
    ),
  fat: z
    .number()
    .nonnegative()
    .describe(
      "Total fat in one serving, in grams (g), including saturated and unsaturated fats"
    ),
});
