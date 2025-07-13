import dayjs from "dayjs";

import { Food, FoodEntry } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";

export interface FoodEntryWithFood extends FoodEntry {
  foods: Food
}

const supabase = createClient();

export const fetchGetFoodEntries = async (
  date?: string
): Promise<FoodEntryWithFood[]> => {
  let query = supabase.from("food_entries").select("*, foods(*)",);

  if (date) {
    const start = dayjs(date).startOf("day").toISOString();
    const end = dayjs(date).add(1, "day").startOf("day").toISOString();

    query = query
      .gte("date", start)
      .lt("date", end);
  }

  const { data, error } = await query;

  console.log(data)

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
};

export const fetchCreateFoodEntry = async (
  foodEntry: Omit<FoodEntry, "id" | "created_at" | "updated_at">
): Promise<FoodEntry> => {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not found. Please make sure you are logged in.");
  }

  const userId = user.id

  const { data, error } = await supabase
    .from("food_entries")
    .insert({...foodEntry, user_id: userId})
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const fetchUpdateFoodEntry = async (
  foodEntry: Partial<FoodEntry> & { id: number }
): Promise<FoodEntry> => {
  const { id, created_at, updated_at, ...updateData } = foodEntry;

  const { data, error } = await supabase
    .from("food_entries")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const fetchDeleteFoodEntry = async (foodEntryId: number): Promise<{ message: string }> => {
  if (!foodEntryId) {
    throw new Error("Food entry ID is required");
  }

  const { error } = await supabase
    .from("food_entries")
    .delete()
    .eq("id", foodEntryId);

  if (error) {
    throw new Error(error.message);
  }

  return { message: "Food entry deleted successfully" };
};
