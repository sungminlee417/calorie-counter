import { Food } from "@/types/supabase";

export const fetchGetFoods = async (): Promise<Food[]> => {
  const response = await fetch("/api/db/food");

  if (!response.ok) {
    throw new Error("Failed to fetch foods");
  }
  return (await response.json()) as Food[];
};

export const fetchCreateFood = async (
  food: Food
): Promise<Food> => {
  const response = await fetch("/api/db/food", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(food),
  });

  if (!response.ok) {
    throw new Error("Failed to create food");
  }
  return await response.json();
};

export const fetchUpdateFood = async (
  food: Food
): Promise<Food> => {
  const response = await fetch(`/api/db/food/${food.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(food),
  });

  if (!response.ok) {
    throw new Error("Failed to update food");
  }
  return await response.json();
};

export const fetchDeleteFood = async (foodId: string) => {
  const response = await fetch(`/api/db/food/${foodId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete food");
  }
  return await response.json();
};
