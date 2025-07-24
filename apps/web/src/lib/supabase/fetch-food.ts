import { Food } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

interface USDAFood {
  fdcId: number;
  brandOwner: string;
  description: string;
  dataType: string;
  foodNutrients: Array<{
    nutrientName: string;
    nutrientNumber: string;
    unitName: string;
    value: number;
  }>;
  servingSize: number;
  servingSizeUnit: string;
}

const fetchExternalFoods = async (
  search: string,
  limit: number,
  offset: number
): Promise<Food[]> => {
  const res = await fetch(
    `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${
      process.env.NEXT_PUBLIC_FDC_API_KEY
    }&query=${encodeURIComponent(search)}&pageSize=${limit}&pageNumber=${
      offset + 1
    }`
  );

  if (!res.ok) throw new Error("Failed to fetch external foods");

  const data = await res.json();

  return (data.foods || []).map((item: USDAFood) => ({
    id: item.fdcId.toString(),
    name: item.description,
    brand: item.brandOwner,
    calories:
      item.foodNutrients.find((n) => n.nutrientNumber === "208")?.value || 0,
    protein:
      item.foodNutrients.find((n) => n.nutrientNumber === "203")?.value || 0,
    carbs:
      item.foodNutrients.find((n) => n.nutrientNumber === "205")?.value || 0,
    fat: item.foodNutrients.find((n) => n.nutrientNumber === "204")?.value || 0,
    serving_size: item.servingSize,
    serving_unit: item.servingSizeUnit,
    source: "usda",
  }));
};

export const fetchGetFoods = async (
  limit = 10,
  page = 0,
  search = ""
): Promise<Food[]> => {
  const offset = page * limit;
  const from = offset;
  const to = offset + limit - 1;

  let internalQuery = supabase
    .from("foods")
    .select("*")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (search.trim()) {
    internalQuery = internalQuery.ilike("name", `%${search.trim()}%`);
  }

  const { data: internalFoodsRaw, error } = await internalQuery;

  if (error) {
    throw new Error(error.message);
  }

  const internalFoods = (internalFoodsRaw ?? []).map((f) => ({
    ...f,
    source: "internal" as const,
  }));

  const externalFoods = await fetchExternalFoods(search.trim(), limit, page);

  return [...internalFoods, ...externalFoods];
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
