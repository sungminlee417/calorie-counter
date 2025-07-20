import { jsonSchema } from "ai";
import { JSONSchema7 } from "json-schema";
import { z } from "zod";

import { createClient } from "@/utils/supabase/server";
import { ToolManager } from "./ToolManager";

const searchFoodSchema = z.object({
  query: z
    .string()
    .min(1)
    .optional()
    .describe("Search term to filter by name or brand"),
  minCalories: z.number().nonnegative().optional().describe("Minimum calories"),
  maxCalories: z.number().nonnegative().optional().describe("Maximum calories"),
  minProtein: z
    .number()
    .nonnegative()
    .optional()
    .describe("Minimum protein (grams)"),
  maxProtein: z
    .number()
    .nonnegative()
    .optional()
    .describe("Maximum protein (grams)"),
  minCarbs: z
    .number()
    .nonnegative()
    .optional()
    .describe("Minimum carbohydrates (grams)"),
  maxCarbs: z
    .number()
    .nonnegative()
    .optional()
    .describe("Maximum carbohydrates (grams)"),
  minFat: z.number().nonnegative().optional().describe("Minimum fat (grams)"),
  maxFat: z.number().nonnegative().optional().describe("Maximum fat (grams)"),
  servingSize: z
    .number()
    .nonnegative()
    .optional()
    .describe("The amount of the food item"),
  servingUnit: z
    .string()
    .optional()
    .describe("The unit for the serving size (e.g. grams, cups, tbsp)"),
});

const searchFoodJsonSchema = z.toJSONSchema(searchFoodSchema) as JSONSchema7;

export class SearchFoodToolManager extends ToolManager {
  constructor() {
    super({
      name: "searchFood",
      description:
        "Search for food items by nutritional info, name or brand, and optionally by serving size and unit",
      parameters: jsonSchema(searchFoodJsonSchema),
      execute: async (input) => {
        try {
          const parsed = searchFoodSchema.parse(input);

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

          let queryBuilder = supabase
            .from("foods")
            .select(
              "id, name, brand, calories, protein, carbs, fat, serving_size, serving_unit"
            )
            .eq("user_id", userId);

          if (parsed.query) {
            queryBuilder = queryBuilder.or(
              `name.ilike.%${parsed.query}%,brand.ilike.%${parsed.query}%`
            );
          }

          if (parsed.minCalories !== undefined) {
            queryBuilder = queryBuilder.gte("calories", parsed.minCalories);
          }
          if (parsed.maxCalories !== undefined) {
            queryBuilder = queryBuilder.lte("calories", parsed.maxCalories);
          }
          if (parsed.minProtein !== undefined) {
            queryBuilder = queryBuilder.gte("protein", parsed.minProtein);
          }
          if (parsed.maxProtein !== undefined) {
            queryBuilder = queryBuilder.lte("protein", parsed.maxProtein);
          }
          if (parsed.minCarbs !== undefined) {
            queryBuilder = queryBuilder.gte("carbs", parsed.minCarbs);
          }
          if (parsed.maxCarbs !== undefined) {
            queryBuilder = queryBuilder.lte("carbs", parsed.maxCarbs);
          }
          if (parsed.minFat !== undefined) {
            queryBuilder = queryBuilder.gte("fat", parsed.minFat);
          }
          if (parsed.maxFat !== undefined) {
            queryBuilder = queryBuilder.lte("fat", parsed.maxFat);
          }

          const { data, error } = await queryBuilder.limit(10);

          if (error) {
            throw new Error(error.message);
          }

          if (!data || data.length === 0) {
            return "No food items found matching your criteria.";
          }

          const resultsSummary = data
            .map(
              (item) =>
                `- ${item.name} (${item.brand || "Unknown brand"}): ${
                  item.calories
                } kcal, ${item.protein}g protein, ${item.carbs}g carbs, ${
                  item.fat
                }g fat${
                  item.serving_size && item.serving_unit
                    ? ` (Serving: ${item.serving_size} ${item.serving_unit})`
                    : ""
                }`
            )
            .join("\n");

          return {
            summary: `Found ${data.length} matching foods:\n${resultsSummary}`,
            items: data,
          };
        } catch (e) {
          return `⚠️ Error while running the tool: ${
            e instanceof Error ? e.message : String(e)
          }`;
        }
      },
    });
  }
}
