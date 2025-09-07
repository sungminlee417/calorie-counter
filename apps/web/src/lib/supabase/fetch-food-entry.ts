import dayjs from "dayjs";

import { Food, FoodEntry } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";

export interface FoodEntryWithFood extends FoodEntry {
  foods: Food;
}

const supabase = createClient();

export const fetchGetFoodEntries = async (
  date?: string
): Promise<FoodEntryWithFood[]> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not found. Please make sure you are logged in.");
  }

  let query = supabase
    .from("food_entries")
    .select("*, foods(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (date) {
    // Filter by logged_at date, handling timezone properly
    const startOfDay = dayjs(date).startOf("day").toISOString();
    const endOfDay = dayjs(date).endOf("day").toISOString();

    query = query.gte("logged_at", startOfDay).lte("logged_at", endOfDay);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
};

export const fetchCreateFoodEntry = async (
  foodEntry: Omit<FoodEntry, "id" | "created_at" | "updated_at">
): Promise<FoodEntry> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not found. Please make sure you are logged in.");
  }

  const userId = user.id;

  const { data, error } = await supabase
    .from("food_entries")
    .insert({ ...foodEntry, user_id: userId })
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
  const { id } = foodEntry;

  // First, fetch the current food entry to compare changes
  const { data: currentEntry, error: fetchError } = await supabase
    .from("food_entries")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError) {
    throw new Error(
      `Failed to fetch current food entry: ${fetchError.message}`
    );
  }

  if (!currentEntry) {
    throw new Error("Food entry not found");
  }

  // Check for changes using our change detection utility
  const { checkFoodEntryChanges } = await import("@/utils/change-detection");
  const changeResult = checkFoodEntryChanges(currentEntry, foodEntry);

  // If no changes detected, return the current entry without updating
  if (!changeResult.hasChanges) {
    return currentEntry;
  }

  // Only update the fields that have actually changed
  const { data, error } = await supabase
    .from("food_entries")
    .update(changeResult.changedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const fetchDeleteFoodEntry = async (
  foodEntryId: number
): Promise<{ message: string }> => {
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
