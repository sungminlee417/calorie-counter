import z from "zod/v4";

export const foodSchema = z.object({
  name: z.string().describe("The common name or title of the food item, e.g., 'Banana' or 'Peanut Butter'"),
  brand: z.string().describe("The manufacturer or brand name associated with the food item, e.g., 'Dole', 'Skippy'"),
  serving_size: z.number().describe("The quantity representing one serving size of the food, expressed as a numeric value"),
  serving_unit: z.string().describe("The unit of measurement for the serving size, such as 'g' for grams, 'oz' for ounces, or 'cup'"),
  calories: z.number().describe("The total energy content in one serving of the food, measured in kilocalories (kcal)"),
  protein: z.number().describe("The amount of protein in one serving, measured in grams (g)"),
  carbs: z.number().describe("The amount of carbohydrates in one serving, measured in grams (g), including sugars and fiber"),
  fat: z.number().describe("The amount of total fat in one serving, measured in grams (g), including saturated and unsaturated fats"),
});
