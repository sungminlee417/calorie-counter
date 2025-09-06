import {
  FDCFoodData,
  FDCSearchResponse,
  FoodProviderError,
  FoodSourceType,
} from "@/types/food-provider";

/**
 * Rate limiter for FDC API requests
 */
class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequestsPerMinute: number;
  private readonly maxRequestsPerHour: number;

  constructor(maxRequestsPerMinute = 1000, maxRequestsPerHour = 10000) {
    this.maxRequestsPerMinute = maxRequestsPerMinute;
    this.maxRequestsPerHour = maxRequestsPerHour;
  }

  async checkLimit(): Promise<void> {
    const now = Date.now();
    const oneMinuteAgo = now - 60 * 1000;
    const oneHourAgo = now - 60 * 60 * 1000;

    // Remove old requests
    this.requests = this.requests.filter((time) => time > oneHourAgo);

    // Count recent requests
    const recentMinuteRequests = this.requests.filter(
      (time) => time > oneMinuteAgo
    ).length;
    const recentHourRequests = this.requests.length;

    // Check limits
    if (recentMinuteRequests >= this.maxRequestsPerMinute) {
      throw new FoodProviderError(
        "Rate limit exceeded: too many requests per minute",
        FoodSourceType.FDC_USDA,
        "RATE_LIMIT_MINUTE"
      );
    }

    if (recentHourRequests >= this.maxRequestsPerHour) {
      throw new FoodProviderError(
        "Rate limit exceeded: too many requests per hour",
        FoodSourceType.FDC_USDA,
        "RATE_LIMIT_HOUR"
      );
    }

    // Record this request
    this.requests.push(now);
  }
}

/**
 * Client for USDA Food Data Central API
 */
export class FDCApiClient {
  private readonly apiKey: string;
  private readonly baseUrl = "https://api.nal.usda.gov/fdc/v1";
  private readonly rateLimiter: RateLimiter;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.FDC_API_KEY || "";

    if (!this.apiKey) {
      throw new FoodProviderError(
        "FDC API key is required. Please set FDC_API_KEY environment variable.",
        FoodSourceType.FDC_USDA,
        "MISSING_API_KEY"
      );
    }

    this.rateLimiter = new RateLimiter();
  }

  /**
   * Search for foods in the FDC database
   */
  async searchFoods(options: {
    query: string;
    pageNumber?: number;
    pageSize?: number;
    dataType?: string[];
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<FDCSearchResponse> {
    await this.rateLimiter.checkLimit();

    try {
      const {
        query,
        pageNumber = 1,
        pageSize = 25,
        dataType = ["Foundation", "SR Legacy", "Branded"],
        sortBy = "dataType.keyword",
        sortOrder = "asc",
      } = options;

      const requestBody = {
        query,
        dataType,
        pageSize: Math.min(pageSize, 200), // FDC API limit
        pageNumber,
        sortBy,
        sortOrder,
        brandOwner: "",
      };

      const response = await fetch(`${this.baseUrl}/foods/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": this.apiKey,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new FoodProviderError(
          `FDC API error: ${response.status} ${response.statusText} - ${errorText}`,
          FoodSourceType.FDC_USDA,
          `HTTP_${response.status}`,
          {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
          }
        );
      }

      const data = (await response.json()) as {
        foods: FDCFoodData[];
        totalHits: number;
        currentPage: number;
        totalPages: number;
      };

      return {
        foods: data.foods || [],
        totalHits: data.totalHits || 0,
        currentPage: data.currentPage || pageNumber,
        totalPages:
          data.totalPages || Math.ceil((data.totalHits || 0) / pageSize),
      };
    } catch (error) {
      if (error instanceof FoodProviderError) {
        throw error;
      }

      throw new FoodProviderError(
        `Failed to search FDC foods: ${(error as Error).message}`,
        FoodSourceType.FDC_USDA,
        "SEARCH_ERROR",
        error
      );
    }
  }

  /**
   * Get a specific food by FDC ID
   */
  async getFoodById(
    fdcId: number,
    format: "abridged" | "full" = "full"
  ): Promise<FDCFoodData | null> {
    await this.rateLimiter.checkLimit();

    try {
      const response = await fetch(
        `${this.baseUrl}/food/${fdcId}?format=${format}&api_key=${this.apiKey}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new FoodProviderError(
          `FDC API error: ${response.status} ${response.statusText} - ${errorText}`,
          FoodSourceType.FDC_USDA,
          `HTTP_${response.status}`,
          {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
          }
        );
      }

      const data = (await response.json()) as FDCFoodData;
      return data;
    } catch (error) {
      if (error instanceof FoodProviderError) {
        throw error;
      }

      throw new FoodProviderError(
        `Failed to get FDC food by ID: ${(error as Error).message}`,
        FoodSourceType.FDC_USDA,
        "GET_BY_ID_ERROR",
        error
      );
    }
  }

  /**
   * Get multiple foods by FDC IDs
   */
  async getFoodsByIds(
    fdcIds: number[],
    format: "abridged" | "full" = "abridged"
  ): Promise<FDCFoodData[]> {
    await this.rateLimiter.checkLimit();

    try {
      if (fdcIds.length === 0) {
        return [];
      }

      // FDC API supports up to 20 IDs per request
      const chunks = [];
      for (let i = 0; i < fdcIds.length; i += 20) {
        chunks.push(fdcIds.slice(i, i + 20));
      }

      const results: FDCFoodData[] = [];

      for (const chunk of chunks) {
        const requestBody = {
          fdcIds: chunk,
          format,
        };

        const response = await fetch(`${this.baseUrl}/foods`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key": this.apiKey,
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new FoodProviderError(
            `FDC API error: ${response.status} ${response.statusText} - ${errorText}`,
            FoodSourceType.FDC_USDA,
            `HTTP_${response.status}`,
            {
              status: response.status,
              statusText: response.statusText,
              body: errorText,
            }
          );
        }

        const data = (await response.json()) as FDCFoodData[];
        results.push(...data);

        // Add a small delay between chunks to be respectful to the API
        if (chunks.length > 1) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      return results;
    } catch (error) {
      if (error instanceof FoodProviderError) {
        throw error;
      }

      throw new FoodProviderError(
        `Failed to get FDC foods by IDs: ${(error as Error).message}`,
        FoodSourceType.FDC_USDA,
        "GET_MULTIPLE_ERROR",
        error
      );
    }
  }

  /**
   * Check if the API key is valid by making a test request
   */
  async validateApiKey(): Promise<boolean> {
    try {
      await this.searchFoods({ query: "apple", pageSize: 1 });
      return true;
    } catch (error) {
      if (
        error instanceof FoodProviderError &&
        error.code?.includes("HTTP_401")
      ) {
        return false;
      }
      throw error;
    }
  }
}
