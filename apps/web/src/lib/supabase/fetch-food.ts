import { Food } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const fetchGetFoods = async (): Promise<Food[]> => {
  const { data: foods, error } = await supabase.from("foods").select("*");

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, created_at, updated_at, ...foodData } = food;

  const { data, error } = await supabase
    .from("foods")
    .update(foodData)
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
