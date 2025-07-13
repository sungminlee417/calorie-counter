import {
  FoodEntryAttributes,
  FoodEntryCreationAttributes,
  FoodEntryWithFood,
} from "@calorie-counter/sequelize";

export const fetchGetFoodEntries = async (): Promise<FoodEntryWithFood[]> => {
  const response = await fetch("/api/db/food-entry");

  if (!response.ok) {
    throw new Error("Failed to fetch foods");
  }
  return (await response.json()) as FoodEntryAttributes[];
};

export const fetchCreateFoodEntry = async (
  foodEntry: FoodEntryCreationAttributes
): Promise<FoodEntryAttributes> => {
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
  foodEntry: FoodEntryAttributes
): Promise<FoodEntryAttributes> => {
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
