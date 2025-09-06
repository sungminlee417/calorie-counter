// Re-export all types and classes for easy importing
export * from "@/types/food-provider";
export * from "./base-food-provider";
export * from "./internal-food-provider";
export * from "./fdc-food-provider";
export * from "./fdc-api-client";
export * from "./food-aggregator-service";

import {
  FoodAggregatorService,
  FoodAggregatorConfig,
} from "./food-aggregator-service";
import { FoodSourceType } from "@/types/food-provider";

/**
 * Singleton instance of the food aggregator service
 */
let aggregatorInstance: FoodAggregatorService | null = null;

/**
 * Get or create the food aggregator service instance
 */
export function getFoodAggregator(
  config?: Partial<FoodAggregatorConfig>
): FoodAggregatorService {
  if (!aggregatorInstance) {
    // Default configuration
    const defaultConfig: Partial<FoodAggregatorConfig> = {
      enabledProviders: [FoodSourceType.INTERNAL, FoodSourceType.FDC_USDA],
      mergeStrategy: "priority",
      deduplication: {
        enabled: true,
        similarity_threshold: 0.85,
      },
      defaultPageSizes: {
        [FoodSourceType.INTERNAL]: 15, // Internal foods get more space
        [FoodSourceType.FDC_USDA]: 10, // External foods get less space
      },
      maxResults: 50,
    };

    aggregatorInstance = new FoodAggregatorService({
      ...defaultConfig,
      ...config,
    });
  }

  return aggregatorInstance;
}

/**
 * Reset the aggregator instance (useful for testing or reconfiguration)
 */
export function resetFoodAggregator(): void {
  aggregatorInstance = null;
}

/**
 * Check if external providers are available
 */
export function isExternalProvidersAvailable(): {
  fdc: boolean;
} {
  return {
    fdc: !!process.env.FDC_API_KEY,
  };
}
