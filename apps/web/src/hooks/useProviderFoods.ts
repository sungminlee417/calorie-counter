import { useMemo } from "react";
import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { Food, FoodSourceType, FoodProviderError } from "@/types/food-provider";
import { AggregatedSearchOptions } from "@/lib/food-providers/food-aggregator-service";
import { getFoodAggregator } from "@/lib/food-providers";
import { InternalFoodProvider } from "@/lib/food-providers/internal-food-provider";
import { PAGE_SIZE } from "@/constants/app";

/**
 * Options for the enhanced foods hook
 */
export interface UseProviderFoodsOptions {
  search?: string;
  providers?: FoodSourceType[];
  searchAllProviders?: boolean;
  enableDeduplication?: boolean;
}

/**
 * Enhanced version of useFoods hook that works with multiple food providers
 * Provides unified search across internal database and external APIs
 */
const useProviderFoods = (options: UseProviderFoodsOptions = {}) => {
  const {
    search = "",
    providers,
    searchAllProviders = true,
    enableDeduplication = true,
  } = options;

  const queryClient = useQueryClient();
  const aggregator = getFoodAggregator();

  // Create query key that includes all relevant options
  const queryKey = useMemo(
    () => [
      "enhanced-foods",
      search.trim(),
      providers?.sort().join(",") || "all",
      searchAllProviders,
      enableDeduplication,
    ],
    [search, providers, searchAllProviders, enableDeduplication]
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      const searchOptions: AggregatedSearchOptions = {
        query: search.trim(),
        page: pageParam,
        pageSize: PAGE_SIZE,
        providers,
        searchAllProviders,
      };

      // Update aggregator config for this search
      if (enableDeduplication !== undefined) {
        aggregator.updateConfig({
          deduplication: {
            enabled: enableDeduplication,
            similarity_threshold: 0.85,
          },
        });
      }

      return await aggregator.searchFoods(searchOptions);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNextPage
        ? lastPage.pagination.page + 1
        : undefined;
    },
    // Enable background refetch for better UX
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on provider errors (API key issues, etc.)
      if (error instanceof FoodProviderError) {
        console.warn("Food provider error:", error.message);
        return false;
      }
      return failureCount < 2;
    },
  });

  // Get individual food by ID and source
  const getFoodById = async (
    id: string,
    source: FoodSourceType
  ): Promise<Food | null> => {
    return await aggregator.getFoodById(id, source);
  };

  // Create food (only for internal provider)
  const createFood = useMutation({
    mutationFn: async (
      newFood: Omit<
        Food,
        "id" | "created_at" | "updated_at" | "source" | "external_id"
      >
    ) => {
      const internalProvider = aggregator["providers"].get(
        FoodSourceType.INTERNAL
      ) as InternalFoodProvider;
      if (!internalProvider || !internalProvider.createFood) {
        throw new FoodProviderError(
          "Internal food provider not available for creating foods",
          FoodSourceType.INTERNAL,
          "PROVIDER_NOT_AVAILABLE"
        );
      }
      return await internalProvider.createFood(newFood);
    },
    onSuccess: () => {
      // Invalidate all enhanced foods queries
      queryClient.invalidateQueries({ queryKey: ["enhanced-foods"] });
    },
  });

  // Update food (only for internal provider)
  const updateFood = useMutation({
    mutationFn: async (updatedFood: Food) => {
      if (updatedFood.source !== FoodSourceType.INTERNAL) {
        throw new FoodProviderError(
          "Only internal foods can be updated",
          updatedFood.source as FoodSourceType,
          "EXTERNAL_FOOD_UPDATE"
        );
      }

      const internalProvider = aggregator["providers"].get(
        FoodSourceType.INTERNAL
      ) as InternalFoodProvider;
      if (!internalProvider || !internalProvider.updateFood) {
        throw new FoodProviderError(
          "Internal food provider not available for updating foods",
          FoodSourceType.INTERNAL,
          "PROVIDER_NOT_AVAILABLE"
        );
      }
      return await internalProvider.updateFood(updatedFood);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enhanced-foods"] });
    },
  });

  // Delete food (only for internal provider)
  const deleteFood = useMutation({
    mutationFn: async (foodId: string) => {
      const internalProvider = aggregator["providers"].get(
        FoodSourceType.INTERNAL
      ) as InternalFoodProvider;
      if (!internalProvider || !internalProvider.deleteFood) {
        throw new FoodProviderError(
          "Internal food provider not available for deleting foods",
          FoodSourceType.INTERNAL,
          "PROVIDER_NOT_AVAILABLE"
        );
      }
      return await internalProvider.deleteFood(foodId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enhanced-foods"] });
    },
  });

  // Save external food to internal database
  const saveExternalFood = useMutation({
    mutationFn: async (externalFood: Food) => {
      if (externalFood.source === FoodSourceType.INTERNAL) {
        throw new FoodProviderError(
          "Food is already in internal database",
          FoodSourceType.INTERNAL,
          "ALREADY_INTERNAL"
        );
      }

      // Convert external food to internal format
      const internalFoodData = {
        name: externalFood.name,
        brand: externalFood.brand,
        serving_size: externalFood.serving_size,
        serving_unit: externalFood.serving_unit,
        calories: externalFood.calories,
        protein: externalFood.protein,
        carbs: externalFood.carbs,
        fat: externalFood.fat,
        provider_metadata: {
          ...externalFood.provider_metadata,
          originalSource: externalFood.source,
          originalExternalId: externalFood.external_id,
          importedAt: new Date().toISOString(),
        },
      };

      return await createFood.mutateAsync(internalFoodData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enhanced-foods"] });
    },
  });

  // Get provider information
  const getProviderInfo = () => {
    return {
      availableProviders: aggregator.getAvailableProviders(),
      enabledProviders: aggregator.getEnabledProviders(),
    };
  };

  // Flatten all pages into a single array
  const foods = useMemo(() => {
    return data?.pages.flatMap((page) => page.foods) ?? [];
  }, [data]);

  // Enhanced error with provider context
  const enhancedError = useMemo(() => {
    if (!error) return null;

    if (error instanceof FoodProviderError) {
      return {
        message: error.message,
        provider: error.provider,
        code: error.code,
        isProviderError: true,
      };
    }

    return {
      message: error.message || "An unexpected error occurred",
      provider: null,
      code: null,
      isProviderError: false,
    };
  }, [error]);

  return {
    // Data
    foods,

    // Loading states
    isLoading,
    isFetchingNextPage,

    // Pagination
    fetchNextPage,
    hasNextPage,

    // Error handling
    error: enhancedError,

    // Actions
    refetch,
    getFoodById,
    createFood,
    updateFood,
    deleteFood,
    saveExternalFood,

    // Provider info
    getProviderInfo,

    // Statistics
    stats: {
      totalResults: foods.length,
      sourceBreakdown: foods.reduce(
        (acc, food) => {
          const source = food.source as FoodSourceType;
          acc[source] = (acc[source] || 0) + 1;
          return acc;
        },
        {} as Record<FoodSourceType, number>
      ),
    },
  };
};

export default useProviderFoods;
