import { jsonSchema } from "ai";
import { JSONSchema7 } from "json-schema";
import z from "zod/v4";

import { createClient } from "@/utils/supabase/server";

import { ToolManager } from "./ToolManager";

const foodEntrySchema = z.object({
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

const foodEntryJsonSchema = z.toJSONSchema(foodEntrySchema) as JSONSchema7;

export class CreateFoodEntryToolManager extends ToolManager {
  constructor() {
    super({
      name: "createFoodEntry",
      description:
        "Create a new food entry for a valid food item in the database. The food_id must exist; otherwise, the operation will fail.",
      parameters: jsonSchema(foodEntryJsonSchema),
      execute: async (input) => {
        try {
          const parsed = foodEntrySchema.parse(input);

          const supabase = await createClient();

          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (!user) {
            throw new Error(
              "User not found. Please make sure you are logged in."
            );
          }
          const userId = user.id;

          // Check if the food_id exists in the foods table
          const { data: foodExists, error: foodError } = await supabase
            .from("foods")
            .select("id")
            .eq("id", parsed.food_id)
            .single();

          if (foodError || !foodExists) {
            throw new Error(
              `Food with ID ${parsed.food_id} does not exist. Please provide a valid food ID.`
            );
          }

          // Insert the food entry
          const { data, error } = await supabase
            .from("food_entries")
            .insert({
              food_id: parsed.food_id,
              quantity: parsed.quantity,
              user_id: userId,
              created_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (error) {
            throw new Error(error.message);
          }

          return `Food entry created for food ID ${data.food_id} with quantity ${data.quantity}.`;
        } catch (e) {
          return `⚠️ Error while running the tool: ${
            e instanceof Error ? e.message : String(e)
          }`;
        }
      },
    });
  }
}
