import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  fetchCreateFood,
  fetchDeleteFood,
  fetchGetFoods,
  fetchUpdateFood,
} from "@/app/api/client/fetch-food";
import { FoodCreationAttributes } from "@calorie-counter/sequelize";

const useFoods = () => {
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ["foods"],
    queryFn: fetchGetFoods,
  });

  const createFood = useMutation({
    mutationFn: (newFood: FoodCreationAttributes) => fetchCreateFood(newFood),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["foods"] }),
  });

  const updateFood = useMutation({
    mutationFn: (updatedFood: FoodCreationAttributes) =>
      fetchUpdateFood(updatedFood),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["foods"] }),
  });

  const deleteFood = useMutation({
    mutationFn: (foodId: string) => fetchDeleteFood(foodId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["foods"] }),
  });

  return {
    foods: data,
    error,
    isLoading,
    createFood: createFood.mutate,
    updateFood: updateFood.mutate,
    deleteFood: deleteFood.mutate,
  };
};

export default useFoods;
