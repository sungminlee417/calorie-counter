import { Food } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const fetchGetFoods = async (
  limit = 10,
  offset = 0,
  search = ""
): Promise<Food[]> => {
  const from = offset;
  const to = offset + limit - 1;

  let query = supabase
    .from("foods")
    .select("*")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (search.trim() !== "") {
    query = query.ilike("name", `%${search.trim()}%`);
  }

  const { data: foods, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return foods ?? [];
};

export const fetchCreateFood = async (
  food: Omit<Food, "id" | "created_at" | "updated_at">
): Promise<Food> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not found. Please make sure you are logged in.");
  }
  const userId = user.id;

  const { data, error } = await supabase
    .from("foods")
    .insert({ ...food, user_id: userId })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const fetchUpdateFood = async (
  food: Partial<Food> & { id: number }
): Promise<Food> => {
  const { id } = food;

  // First, fetch the current food to compare changes
  const { data: currentFood, error: fetchError } = await supabase
    .from("foods")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError) {
    throw new Error(`Failed to fetch current food: ${fetchError.message}`);
  }

  if (!currentFood) {
    throw new Error("Food not found");
  }

  // Check for changes using our change detection utility
  const { checkFoodChanges } = await import("@/utils/change-detection");
  const changeResult = checkFoodChanges(currentFood, food);

  // If no changes detected, return the current food without updating
  if (!changeResult.hasChanges) {
    console.log("No changes detected for food, skipping database update");
    return currentFood;
  }

  console.log(`Updating food: ${changeResult.message}`);

  // Only update the fields that have actually changed
  const { data, error } = await supabase
    .from("foods")
    .update(changeResult.changedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data!;
};

export const fetchDeleteFood = async (
  foodId: number
): Promise<{ message: string }> => {
  if (!foodId) {
    throw new Error("Food ID is required");
  }

  const { error } = await supabase.from("foods").delete().eq("id", foodId);

  if (error) {
    throw new Error(error.message);
  }

  return { message: "Food deleted successfully" };
};
