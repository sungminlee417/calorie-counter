import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";

import {
  fetchCreateFoodEntry,
  fetchDeleteFoodEntry,
  fetchGetFoodEntries,
  fetchUpdateFoodEntry,
} from "@/lib/supabase/fetch-food-entry";
import { FoodEntry } from "@/types/supabase";

const useFoodEntries = (date?: Date) => {
  const queryClient = useQueryClient();

  const formattedDate = date ? dayjs(date).format("YYYY-MM-DD") : undefined;

  const { data, error, isLoading } = useQuery({
    queryKey: ["food-entries", formattedDate],
    queryFn: () => fetchGetFoodEntries(formattedDate),
  });

  const createFoodEntry = useMutation({
    mutationFn: (
      newFoodEntry: Omit<FoodEntry, "id" | "created_at" | "updated_at">
    ) => fetchCreateFoodEntry(newFoodEntry),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["food-entries"] }),
  });

  const updateFoodEntry = useMutation({
    mutationFn: (
      updatedFoodEntry: Omit<FoodEntry, "created_at" | "updated_at">
    ) => fetchUpdateFoodEntry(updatedFoodEntry),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["food-entries"] }),
  });

  const deleteFoodEntry = useMutation({
    mutationFn: (foodEntryId: string) =>
      fetchDeleteFoodEntry(Number(foodEntryId)),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["food-entries"] }),
  });

  return {
    foodEntries: data,
    error,
    isLoading,
    createFoodEntry,
    updateFoodEntry,
    deleteFoodEntry,
  };
};

export default useFoodEntries;
