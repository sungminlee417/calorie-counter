import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";

import {
  fetchCreateFood,
  fetchDeleteFood,
  fetchGetFoods,
  fetchUpdateFood,
} from "@/lib/supabase/fetch-food";
import { Food } from "@/types/supabase";

const PAGE_SIZE = 10;

const useFoods = (search: string = "") => {
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["foods", search],
    queryFn: ({ pageParam = 0 }) => fetchGetFoods(PAGE_SIZE, pageParam, search),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < PAGE_SIZE ? undefined : allPages.length * PAGE_SIZE,
  });

  const createFood = useMutation({
    mutationFn: (newFood: Omit<Food, "id" | "created_at" | "updated_at">) =>
      fetchCreateFood(newFood),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["foods", search] }),
  });

  const updateFood = useMutation({
    mutationFn: (updatedFood: Food) => fetchUpdateFood(updatedFood),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["foods", search] }),
  });

  const deleteFood = useMutation({
    mutationFn: (foodId: string) => fetchDeleteFood(Number(foodId)),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["foods", search] }),
  });

  return {
    foods: data?.pages.flat() ?? [],
    error,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
    createFood,
    updateFood,
    deleteFood,
  };
};

export default useFoods;
