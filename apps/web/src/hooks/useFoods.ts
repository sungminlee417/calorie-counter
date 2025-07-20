import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  fetchCreateFood,
  fetchDeleteFood,
  fetchGetFoods,
  fetchUpdateFood,
} from "@/lib/supabase/fetch-food";
import { Food } from "@/types/supabase";

const useFoods = () => {
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ["foods"],
    queryFn: fetchGetFoods,
  });

  const createFood = useMutation({
    mutationFn: (newFood: Omit<Food, "id" | "created_at" | "updated_at">) =>
      fetchCreateFood(newFood),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["foods"] }),
  });

  const updateFood = useMutation({
    mutationFn: (updatedFood: Food) => fetchUpdateFood(updatedFood),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["foods"] }),
  });

  const deleteFood = useMutation({
    mutationFn: (foodId: string) => fetchDeleteFood(Number(foodId)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["foods"] }),
  });

  return {
    foods: data,
    error,
    isLoading,
    createFood,
    updateFood,
    deleteFood,
  };
};

export default useFoods;
