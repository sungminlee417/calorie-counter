import { jsonSchema } from "ai";

import { createClient } from "@/utils/supabase/server";
import { ToolManager } from "./ToolManager";

export class GetMacroGoalsToolManager extends ToolManager {
  constructor() {
    super({
      name: "getMacroGoals",
      description:
        "Fetch the logged-in user's macro nutrition goals (calories, protein, carbs, fat).",
      parameters: jsonSchema({
        type: "object",
        properties: {},
        additionalProperties: false,
      }),
      execute: async () => {
        try {
          const supabase = await createClient();

          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (!user) {
            throw new Error(
              "User not found. Please make sure you are logged in."
            );
          }

          const { data, error } = await supabase
            .from("macro_goals")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle();

          if (error) {
            throw new Error(error.message);
          }

          if (!data) {
            return "No macro goals found for the user.";
          }

          return {
            calories: data.calories,
            protein: data.protein,
            carbs: data.carbs,
            fat: data.fat,
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
