import { FoodEntry } from "@/types/supabase";

export const fetchGetFoodEntries = async (
  date?: string
): Promise<FoodEntry[]> => {
  const url = new URL("/api/db/food-entry", window.location.origin);

  if (date) {
    url.searchParams.set("date", date);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("Failed to fetch foods");
  }
  return (await response.json()) as FoodEntry[];
};

export const fetchCreateFoodEntry = async (
  foodEntry: FoodEntry
): Promise<FoodEntry> => {
  const response = await fetch("/api/db/food-entry", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(foodEntry),
  });

  if (!response.ok) {
    throw new Error("Failed to create food-entry");
  }
  return await response.json();
};

export const fetchUpdateFoodEntry = async (
  foodEntry: FoodEntry
): Promise<FoodEntry> => {
  const response = await fetch(`/api/db/food-entry/${foodEntry.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(foodEntry),
  });

  if (!response.ok) {
    throw new Error("Failed to update food entry");
  }
  return await response.json();
};

export const fetchDeleteFoodEntry = async (foodEntryId: string) => {
  const response = await fetch(`/api/db/food-entry/${foodEntryId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete food entry");
  }
  return await response.json();
};
