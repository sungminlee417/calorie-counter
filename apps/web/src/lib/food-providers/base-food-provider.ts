import {
  EnhancedFood,
  FoodProviderResponse,
  FoodSearchOptions,
  FoodSourceType,
  FoodProviderConfig,
  FoodProviderError,
} from "@/types/food-provider";

/**
 * Abstract base class for all food providers
 * Defines the standard interface that all food providers must implement
 */
export abstract class BaseFoodProvider {
  protected config: FoodProviderConfig;
  public readonly sourceType: FoodSourceType;

  constructor(sourceType: FoodSourceType, config: FoodProviderConfig) {
    this.sourceType = sourceType;
    this.config = config;
  }

  /**
   * Search for foods using the provider's API
   * @param options Search options including query, pagination, and filters
   * @returns Promise resolving to standardized food provider response
   */
  abstract searchFoods(
    options: FoodSearchOptions
  ): Promise<FoodProviderResponse>;

  /**
   * Get a specific food by its ID in the provider's system
   * @param id The food ID in the provider's system
   * @returns Promise resolving to enhanced food or null if not found
   */
  abstract getFoodById(id: string): Promise<EnhancedFood | null>;

  /**
   * Get provider configuration
   */
  getConfig(): FoodProviderConfig {
    return { ...this.config };
  }

  /**
   * Update provider configuration
   */
  updateConfig(newConfig: Partial<FoodProviderConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Check if the provider is enabled
   */
  isEnabled(): boolean {
    return this.config.enabled;
  }

  /**
   * Get provider priority (higher number = higher priority)
   */
  getPriority(): number {
    return this.config.priority;
  }

  /**
   * Validate search options specific to this provider
   * Can be overridden by specific providers for custom validation
   */
  protected validateSearchOptions(options: FoodSearchOptions): void {
    if (options.pageSize && (options.pageSize < 1 || options.pageSize > 200)) {
      throw new FoodProviderError(
        "Page size must be between 1 and 200",
        this.sourceType,
        "INVALID_PAGE_SIZE"
      );
    }

    if (options.page && options.page < 1) {
      throw new FoodProviderError(
        "Page number must be greater than 0",
        this.sourceType,
        "INVALID_PAGE_NUMBER"
      );
    }
  }

  /**
   * Handle provider-specific errors and convert them to FoodProviderError
   */
  protected handleError(error: unknown, operation: string): never {
    if (error instanceof FoodProviderError) {
      throw error;
    }

    const message = (error as Error)?.message || `${operation} failed`;
    const code = (error as { code?: string })?.code || "PROVIDER_ERROR";

    throw new FoodProviderError(
      `${this.sourceType}: ${message}`,
      this.sourceType,
      code,
      error
    );
  }

  /**
   * Rate limiting check (can be implemented by providers that need it)
   */
  protected async checkRateLimit(): Promise<void> {
    // Default implementation does nothing
    // Providers with rate limits should override this
  }

  /**
   * Transform provider-specific food data to enhanced food format
   * Must be implemented by each provider
   */
  protected abstract transformToEnhancedFood(
    providerFood: unknown,
    metadata?: Record<string, unknown>
  ): EnhancedFood;
}
