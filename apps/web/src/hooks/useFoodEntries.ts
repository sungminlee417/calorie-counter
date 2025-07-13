import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";

import {
  fetchCreateFoodEntry,
  fetchDeleteFoodEntry,
  fetchGetFoodEntries,
  fetchUpdateFoodEntry,
} from "@/lib/supabase/fetch-food-entry";
import { FoodEntry } from "@/types/supabase";

const useFoodEntries = (date: Date) => {
  const queryClient = useQueryClient();

  const formattedDate = dayjs(date).format("YYYY-MM-DD");

  const { data, error, isLoading } = useQuery({
    queryKey: ["food-entries", formattedDate],
    queryFn: () => fetchGetFoodEntries(formattedDate),
    enabled: !!date,
  });

  const createFoodEntry = useMutation({
    mutationFn: (newFoodEntry: Omit<FoodEntry, 'id' | 'created_at' | 'updated_at'>) =>
      fetchCreateFoodEntry(newFoodEntry),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["food-entries"] }),
  });

  const updateFoodEntry = useMutation({
    mutationFn: (updatedFoodEntry: FoodEntry) =>
      fetchUpdateFoodEntry(updatedFoodEntry),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["food-entries"] }),
  });

  const deleteFoodEntry = useMutation({
    mutationFn: (foodEntryId: string) => fetchDeleteFoodEntry(Number(foodEntryId)),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["food-entries"] }),
  });

  return {
    foodEntries: data,
    error,
    isLoading,
    createFoodEntry: createFoodEntry.mutate,
    updateFoodEntry: updateFoodEntry.mutate,
    deleteFoodEntry: deleteFoodEntry.mutate,
  };
};

export default useFoodEntries;
