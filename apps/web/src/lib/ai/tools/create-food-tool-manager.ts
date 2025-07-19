import { jsonSchema } from "ai";
import z from "zod/v4";

import { foodSchema } from "@/types/food";
import { createClient } from "@/utils/supabase/server";
import { JSONSchema7 } from "json-schema";

import { Food } from "@/types/supabase";

import { ToolManager } from "./ToolManager";

export class CreateFoodToolManager extends ToolManager {
  constructor() {
    super({
      name: "createFood",
      description: "Create a new food item with nutritional information",
      parameters: jsonSchema(z.toJSONSchema(foodSchema) as JSONSchema7),
      execute: async (input) => {
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

        const { data, error } = await supabase
          .from("foods")
          .insert({ ...(input as Food), user_id: userId })
          .select()
          .single();

        if (error) {
          throw new Error(error.message);
        }

        return `Food '${data.name}' created successfully with ${data.calories} kcal.`;
      },
    });
  }
}
