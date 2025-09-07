import {
  Food,
  FoodProviderResponse,
  FoodSearchOptions,
  FoodSourceType,
  FoodProviderError,
  PaginationMetadata,
} from "@/types/food-provider";
import { BaseFoodProvider } from "./base-food-provider";
import { InternalFoodProvider } from "./internal-food-provider";
import { FDCFoodProvider } from "./fdc-food-provider";

/**
 * Configuration for the food aggregator
 */
export interface FoodAggregatorConfig {
  // Which providers to enable
  enabledProviders: FoodSourceType[];

  // How to merge results
  mergeStrategy: "interleave" | "priority" | "source_groups";

  // Deduplication settings
  deduplication: {
    enabled: boolean;
    similarity_threshold: number; // 0-1, how similar foods need to be to be considered duplicates
  };

  // Default page sizes per provider
  defaultPageSizes: Partial<Record<FoodSourceType, number>>;

  // Maximum total results to return
  maxResults: number;
}

/**
 * Extended search options for aggregated searches
 */
export interface AggregatedSearchOptions extends FoodSearchOptions {
  // Limit search to specific providers
  providers?: FoodSourceType[];

  // Whether to search all providers or stop after first successful result
  searchAllProviders?: boolean;

  // Custom priority override for this search
  providerPriority?: Partial<Record<FoodSourceType, number>>;
}

/**
 * Service that orchestrates multiple food providers to provide unified search results
 */
export class FoodAggregatorService {
  private providers: Map<FoodSourceType, BaseFoodProvider> = new Map();
  private config: FoodAggregatorConfig;

  constructor(config?: Partial<FoodAggregatorConfig>) {
    this.config = {
      enabledProviders: [FoodSourceType.INTERNAL, FoodSourceType.FDC_USDA],
      mergeStrategy: "priority",
      deduplication: {
        enabled: true,
        similarity_threshold: 0.8,
      },
      defaultPageSizes: {
        [FoodSourceType.INTERNAL]: 10,
        [FoodSourceType.FDC_USDA]: 15,
      },
      maxResults: 50,
      ...config,
    };

    this.initializeProviders();
  }

  /**
   * Initialize food providers based on configuration
   */
  private initializeProviders(): void {
    // Always initialize internal provider
    try {
      const internalProvider = new InternalFoodProvider({
        enabled: this.config.enabledProviders.includes(FoodSourceType.INTERNAL),
      });
      this.providers.set(FoodSourceType.INTERNAL, internalProvider);
    } catch (error) {
      console.warn("Failed to initialize internal food provider:", error);
    }

    // Initialize FDC provider if API key is available
    try {
      if (process.env.FDC_API_KEY) {
        const fdcProvider = new FDCFoodProvider(process.env.FDC_API_KEY, {
          enabled: this.config.enabledProviders.includes(
            FoodSourceType.FDC_USDA
          ),
        });
        this.providers.set(FoodSourceType.FDC_USDA, fdcProvider);
      }
    } catch (error) {
      console.warn("Failed to initialize FDC food provider:", error);
    }
  }

  /**
   * Search for foods across all enabled providers
   */
  async searchFoods(
    options: AggregatedSearchOptions
  ): Promise<FoodProviderResponse> {
    const {
      providers = this.config.enabledProviders,
      providerPriority,
      ...searchOptions
    } = options;

    // Get enabled providers for this search
    const activeProviders = this.getActiveProviders(providers);

    if (activeProviders.length === 0) {
      return {
        foods: [],
        pagination: {
          page: options.page || 1,
          pageSize: options.pageSize || 25,
          hasNextPage: false,
          hasPreviousPage: false,
          totalItems: 0,
          totalPages: 0,
        },
        source: FoodSourceType.INTERNAL, // Default source
      };
    }

    try {
      // Search all providers concurrently
      const searchPromises = activeProviders.map(async (provider) => {
        try {
          const providerOptions = {
            ...searchOptions,
            pageSize:
              this.config.defaultPageSizes[provider.sourceType] ||
              searchOptions.pageSize ||
              25,
          };

          return await provider.searchFoods(providerOptions);
        } catch (error) {
          console.warn(
            `Search failed for provider ${provider.sourceType}:`,
            error
          );
          // Return empty results on provider failure
          return {
            foods: [],
            pagination: {
              page: searchOptions.page || 1,
              pageSize: searchOptions.pageSize || 25,
              hasNextPage: false,
              hasPreviousPage: false,
            },
            source: provider.sourceType,
          };
        }
      });

      const results = await Promise.all(searchPromises);

      // Merge results from all providers
      return this.mergeResults(results, searchOptions, providerPriority);
    } catch (error) {
      throw new FoodProviderError(
        `Aggregated search failed: ${(error as Error).message}`,
        FoodSourceType.INTERNAL,
        "AGGREGATION_ERROR",
        error
      );
    }
  }

  /**
   * Get a food by ID from the appropriate provider
   */
  async getFoodById(id: string, source: FoodSourceType): Promise<Food | null> {
    const provider = this.providers.get(source);

    if (!provider || !provider.isEnabled()) {
      return null;
    }

    try {
      return await provider.getFoodById(id);
    } catch (error) {
      console.warn(`Get food by ID failed for provider ${source}:`, error);
      return null;
    }
  }

  /**
   * Get active providers for a search
   */
  private getActiveProviders(
    requestedProviders: FoodSourceType[]
  ): BaseFoodProvider[] {
    return requestedProviders
      .map((sourceType) => this.providers.get(sourceType))
      .filter(
        (provider) => provider && provider.isEnabled()
      ) as BaseFoodProvider[];
  }

  /**
   * Merge results from multiple providers
   */
  private mergeResults(
    results: FoodProviderResponse[],
    searchOptions: FoodSearchOptions,
    providerPriority?: Partial<Record<FoodSourceType, number>>
  ): FoodProviderResponse {
    // Collect all foods with their priorities
    const allFoods: Array<{ food: Food; priority: number }> = [];

    for (const result of results) {
      const priority =
        providerPriority?.[result.source] ??
        this.providers.get(result.source)?.getPriority() ??
        0;

      for (const food of result.foods) {
        allFoods.push({ food, priority });
      }
    }

    // Apply deduplication if enabled
    const deduplicatedFoods = this.config.deduplication.enabled
      ? this.deduplicateFoods(allFoods)
      : allFoods;

    // Sort by priority and merge strategy
    const sortedFoods = this.sortFoodsByStrategy(deduplicatedFoods);

    // Apply pagination
    const page = searchOptions.page || 1;
    const pageSize = searchOptions.pageSize || 25;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedFoods = sortedFoods.slice(startIndex, endIndex);

    // Calculate pagination metadata
    const totalItems = sortedFoods.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    const pagination: PaginationMetadata = {
      page,
      pageSize,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    return {
      foods: paginatedFoods.map((item) => item.food),
      pagination,
      source: FoodSourceType.INTERNAL, // Represents aggregated results
    };
  }

  /**
   * Remove duplicate foods based on similarity
   */
  private deduplicateFoods(
    foods: Array<{ food: Food; priority: number }>
  ): Array<{ food: Food; priority: number }> {
    const deduplicated: Array<{ food: Food; priority: number }> = [];

    for (const candidate of foods) {
      const isDuplicate = deduplicated.some(
        (existing) =>
          this.calculateFoodSimilarity(candidate.food, existing.food) >=
          this.config.deduplication.similarity_threshold
      );

      if (!isDuplicate) {
        deduplicated.push(candidate);
      } else {
        // If it's a duplicate but has higher priority, replace the existing one
        const existingIndex = deduplicated.findIndex(
          (existing) =>
            this.calculateFoodSimilarity(candidate.food, existing.food) >=
            this.config.deduplication.similarity_threshold
        );

        if (
          existingIndex !== -1 &&
          candidate.priority > deduplicated[existingIndex].priority
        ) {
          deduplicated[existingIndex] = candidate;
        }
      }
    }

    return deduplicated;
  }

  /**
   * Calculate similarity between two foods (0-1 scale)
   */
  private calculateFoodSimilarity(food1: Food, food2: Food): number {
    // Simple similarity based on name matching
    const name1 = food1.name.toLowerCase().trim();
    const name2 = food2.name.toLowerCase().trim();

    // Exact match
    if (name1 === name2) {
      return 1.0;
    }

    // Check if one name contains the other
    if (name1.includes(name2) || name2.includes(name1)) {
      return 0.8;
    }

    // Simple word overlap calculation
    const words1 = name1.split(/\s+/);
    const words2 = name2.split(/\s+/);
    const commonWords = words1.filter((word) => words2.includes(word));

    if (commonWords.length === 0) {
      return 0;
    }

    const similarity =
      (commonWords.length * 2) / (words1.length + words2.length);
    return Math.min(similarity, 0.9); // Cap at 0.9 for word overlap
  }

  /**
   * Sort foods by the configured merge strategy
   */
  private sortFoodsByStrategy(
    foods: Array<{ food: Food; priority: number }>
  ): Array<{ food: Food; priority: number }> {
    switch (this.config.mergeStrategy) {
      case "priority":
        return foods.sort((a, b) => b.priority - a.priority);

      case "source_groups":
        return foods.sort((a, b) => {
          // First sort by source type, then by priority within source
          if (a.food.source !== b.food.source) {
            return a.food.source.localeCompare(b.food.source);
          }
          return b.priority - a.priority;
        });

      case "interleave":
        // Group by source, then interleave
        const groupedBySource = new Map<
          FoodSourceType,
          Array<{ food: Food; priority: number }>
        >();

        for (const item of foods) {
          const source = item.food.source as FoodSourceType;
          if (!groupedBySource.has(source)) {
            groupedBySource.set(source, []);
          }
          groupedBySource.get(source)!.push(item);
        }

        // Sort each group by priority
        for (const group of groupedBySource.values()) {
          group.sort((a, b) => b.priority - a.priority);
        }

        // Interleave results
        const interleaved: Array<{ food: Food; priority: number }> = [];
        const sources = Array.from(groupedBySource.keys()).sort();
        const maxLength = Math.max(
          ...Array.from(groupedBySource.values()).map((group) => group.length)
        );

        for (let i = 0; i < maxLength; i++) {
          for (const source of sources) {
            const group = groupedBySource.get(source);
            if (group && i < group.length) {
              interleaved.push(group[i]);
            }
          }
        }

        return interleaved;

      default:
        return foods;
    }
  }

  /**
   * Get available provider types
   */
  getAvailableProviders(): FoodSourceType[] {
    return Array.from(this.providers.keys());
  }

  /**
   * Get enabled provider types
   */
  getEnabledProviders(): FoodSourceType[] {
    return Array.from(this.providers.entries())
      .filter(([, provider]) => provider.isEnabled())
      .map(([sourceType]) => sourceType);
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<FoodAggregatorConfig>): void {
    this.config = { ...this.config, ...newConfig };

    // Update provider enabled states
    for (const [sourceType, provider] of this.providers.entries()) {
      provider.updateConfig({
        enabled: this.config.enabledProviders.includes(sourceType),
      });
    }
  }
}
