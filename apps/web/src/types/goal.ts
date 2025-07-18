import z from "zod/v4";

export const macroGoalSchema = z
  .object({
    protein: z
      .number()
      .min(0, "Protein must be 0 or greater")
      .describe("Protein intake per day in grams"),
    fat: z
      .number()
      .min(0, "Fat must be 0 or greater")
      .describe("Fat intake per day in grams"),
    carbs: z
      .number()
      .min(0, "Carbs must be 0 or greater")
      .describe("Carbohydrates intake per day in grams"),
    calories: z
      .number()
      .min(0, "Calories must be 0 or greater")
      .describe(
        "Total calories calculated as (protein * 4) + (carbs * 4) + (fat * 9)"
      ),
  })
  .refine(
    (data) => data.calories === data.protein * 4 + data.carbs * 4 + data.fat * 9,
    {
      message: "Calories must equal protein*4 + carbs*4 + fat*9",
      path: ["calories"],
    }
  );
