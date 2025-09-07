import { useMemo } from "react";
import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { Food, FoodSourceType, FoodProviderError } from "@/types/food-provider";
import { PAGE_SIZE } from "@/constants/app";

/**
 * Options for the server-side enhanced foods hook
 */
export interface UseServerFoodsOptions {
  search?: string;
  providers?: FoodSourceType[];
  enableDeduplication?: boolean;
}

/**
 * Server-side version of enhanced foods hook that uses API routes
 * Keeps API keys secure and provides better caching/performance
 */
const useServerFoods = (options: UseServerFoodsOptions = {}) => {
  const {
    search = "",
    providers = [FoodSourceType.INTERNAL, FoodSourceType.FDC_USDA],
    enableDeduplication = true,
  } = options;

  const queryClient = useQueryClient();

  // Create query key that includes all relevant options
  const queryKey = useMemo(
    () => [
      "server-enhanced-foods",
      search.trim(),
      providers.sort().join(","),
      enableDeduplication,
    ],
    [search, providers, enableDeduplication]
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
      const response = await fetch("/api/foods/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: search.trim(),
          page: pageParam,
          pageSize: PAGE_SIZE,
          providers,
          enableDeduplication,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new FoodProviderError(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`,
          FoodSourceType.INTERNAL, // Default to internal for API errors
          `HTTP_${response.status}`
        );
      }

      return await response.json();
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

      // Use existing internal food creation endpoint
      const { fetchCreateFood } = await import("@/lib/supabase/fetch-food");

      const internalFoodData = {
        name: externalFood.name,
        brand: externalFood.brand || null,
        serving_size: externalFood.serving_size,
        serving_unit: externalFood.serving_unit,
        calories: externalFood.calories,
        protein: externalFood.protein,
        carbs: externalFood.carbs,
        fat: externalFood.fat,
        user_id: "", // Will be set by the function
      };

      return await fetchCreateFood(internalFoodData);
    },
    onSuccess: () => {
      // Invalidate all enhanced foods queries
      queryClient.invalidateQueries({ queryKey: ["server-enhanced-foods"] });
    },
  });

  // Get provider information (server-side check)
  const getProviderInfo = () => {
    // This would ideally come from a server endpoint that checks available providers
    // For now, we'll use environment variable presence
    return {
      availableProviders: [FoodSourceType.INTERNAL, FoodSourceType.FDC_USDA],
      enabledProviders: providers,
    };
  };

  // Flatten all pages into a single array
  const foods = useMemo(() => {
    return data?.pages.flatMap((page) => page.foods) ?? [];
  }, [data]);

  // Get stats from the latest page
  const stats = useMemo(() => {
    if (!data?.pages.length) {
      return {
        totalResults: 0,
        sourceBreakdown: {},
      };
    }

    const latestPage = data.pages[data.pages.length - 1];
    return (
      latestPage.stats || {
        totalResults: foods.length,
        sourceBreakdown: foods.reduce(
          (acc, food) => {
            acc[food.source] = (acc[food.source] || 0) + 1;
            return acc;
          },
          {} as Record<FoodSourceType, number>
        ),
      }
    );
  }, [data, foods]);

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
    saveExternalFood,

    // Provider info
    getProviderInfo,

    // Statistics
    stats,
  };
};

export default useServerFoods;
