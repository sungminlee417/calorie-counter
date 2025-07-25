import { jsonSchema } from "ai";
import { JSONSchema7 } from "json-schema";
import z from "zod";

import { createClient } from "@/utils/supabase/server";
import { ToolManager } from "./ToolManager";
import dayjs from "dayjs";

const getFoodEntriesByDateSchema = z.object({
  date: z
    .string()
    .optional()
    .describe(
      "Date to fetch entries for, format YYYY-MM-DD. Defaults to today if omitted."
    ),
});

const getFoodEntriesByDateJsonSchema = z.toJSONSchema(
  getFoodEntriesByDateSchema
) as JSONSchema7;

export class GetFoodEntriesByDateToolManager extends ToolManager {
  constructor() {
    super({
      name: "getFoodEntriesByDate",
      description:
        "Fetch all food entries logged by the user for a given date, including nutritional info and serving details",
      parameters: jsonSchema(getFoodEntriesByDateJsonSchema),
      execute: async (input) => {
        try {
          const parsed = getFoodEntriesByDateSchema.parse(input);

          const supabase = await createClient();

          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (!user) {
            throw new Error(
              "User not found. Please make sure you are logged in."
            );
          }

          const targetDate = parsed.date ? dayjs(parsed.date) : dayjs();

          if (!targetDate.isValid()) {
            throw new Error("Invalid date format. Please use YYYY-MM-DD.");
          }

          const startOfDay = targetDate.startOf("day").toISOString();
          const startOfNextDay = targetDate
            .add(1, "day")
            .startOf("day")
            .toISOString();

          const { data, error } = await supabase
            .from("food_entries")
            .select("*, foods(*)")
            .eq("user_id", user.id)
            .gte("created_at", startOfDay)
            .lt("created_at", startOfNextDay)
            .order("created_at", { ascending: false });

          if (error) {
            throw new Error(error.message);
          }

          if (!data || data.length === 0) {
            return `You have no food entries logged for ${targetDate.format(
              "YYYY-MM-DD"
            )}.`;
          }

          const resultsSummary = data
            .map((entry) => {
              const food = entry.foods;
              if (!food) return null;
              const qty = entry.quantity || 1;
              const factor = qty / (food.serving_size || 1);
              const calories = (food.calories || 0) * factor;
              const protein = (food.protein || 0) * factor;
              const carbs = (food.carbs || 0) * factor;
              const fat = (food.fat || 0) * factor;

              return (
                `- ${food.name} (${
                  food.brand || "Unknown brand"
                }), qty: ${qty} ${food.serving_unit || "servings"}: ` +
                `${calories.toFixed(0)} kcal, ${protein.toFixed(
                  1
                )}g protein, ${carbs.toFixed(1)}g carbs, ${fat.toFixed(1)}g fat`
              );
            })
            .filter(Boolean)
            .join("\n");

          return {
            summary: `Food entries for ${targetDate.format("YYYY-MM-DD")} (${
              data.length
            } items):\n${resultsSummary}`,
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
