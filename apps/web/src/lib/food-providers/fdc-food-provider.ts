import {
  Food,
  FoodProviderResponse,
  FoodSearchOptions,
  FoodSourceType,
  FoodProviderConfig,
  PaginationMetadata,
  FDCFoodData,
  FDC_NUTRIENT_IDS,
} from "@/types/food-provider";
import { BaseFoodProvider } from "./base-food-provider";
import { FDCApiClient } from "./fdc-api-client";

/**
 * Food provider for USDA Food Data Central API
 * Transforms FDC data into the standardized enhanced food format
 */
export class FDCFoodProvider extends BaseFoodProvider {
  private client: FDCApiClient;

  constructor(apiKey?: string, config?: Partial<FoodProviderConfig>) {
    const defaultConfig: FoodProviderConfig = {
      enabled: true,
      priority: 5, // Lower priority than internal foods
      rateLimit: {
        requestsPerMinute: 100,
        requestsPerDay: 10000,
      },
      cache: {
        ttl: 60 * 60 * 1000, // 1 hour cache for external API
      },
    };

    super(FoodSourceType.FDC_USDA, { ...defaultConfig, ...config });
    this.client = new FDCApiClient(apiKey);
  }

  async searchFoods(options: FoodSearchOptions): Promise<FoodProviderResponse> {
    try {
      this.validateSearchOptions(options);
      await this.checkRateLimit();

      const {
        query = "",
        page = 1,
        pageSize = 25,
        sortBy = "dataType.keyword",
        sortOrder = "asc",
      } = options;

      if (!query.trim()) {
        // Return empty results for empty queries
        return {
          foods: [],
          pagination: {
            page,
            pageSize,
            hasNextPage: false,
            hasPreviousPage: false,
            totalItems: 0,
            totalPages: 0,
          },
          source: this.sourceType,
        };
      }

      const response = await this.client.searchFoods({
        query,
        pageNumber: page,
        pageSize,
        sortBy,
        sortOrder,
      });

      // Transform to foods
      const foods = response.foods.map((food) => this.transformToFood(food));

      // Create pagination metadata
      const pagination: PaginationMetadata = {
        page: response.currentPage,
        pageSize,
        totalItems: response.totalHits,
        totalPages: response.totalPages,
        hasNextPage: response.currentPage < response.totalPages,
        hasPreviousPage: response.currentPage > 1,
      };

      return {
        foods: foods,
        pagination,
        source: this.sourceType,
      };
    } catch (error) {
      this.handleError(error, "searchFoods");
    }
  }

  async getFoodById(id: string): Promise<Food | null> {
    try {
      await this.checkRateLimit();

      const fdcId = parseInt(id, 10);
      if (isNaN(fdcId)) {
        return null;
      }

      const foodData = await this.client.getFoodById(fdcId);

      if (!foodData) {
        return null;
      }

      return this.transformToFood(foodData);
    } catch (error) {
      this.handleError(error, "getFoodById");
    }
  }

  /**
   * Transform FDC food data to food format
   */
  protected transformToFood(fdcFood: unknown): Food {
    const food = fdcFood as FDCFoodData;

    // Extract nutrient values
    const nutrients = this.extractNutrients(food.foodNutrients || []);

    // Determine serving size
    const servingInfo = this.determineServingSize(food);

    // Create brand information
    const brand = this.createBrandInfo(food);

    return {
      // Core food properties
      name: this.cleanFoodName(food.description || "Unknown Food"),
      brand,
      serving_size: servingInfo.size,
      serving_unit: servingInfo.unit,
      calories: nutrients.calories,
      protein: nutrients.protein,
      carbs: nutrients.carbs,
      fat: nutrients.fat,

      // Source metadata
      source: FoodSourceType.FDC_USDA,
      external_id: food.fdcId?.toString(),
      provider_metadata: {
        fdcId: food.fdcId,
        dataType: (food as FDCFoodData & { dataType?: string }).dataType,
        brandOwner: food.brandOwner,
        brandName: food.brandName,
        ingredients: (food as FDCFoodData & { ingredients?: string })
          .ingredients,
        foodPortions: food.foodPortions,
        originalDescription: food.description,
      },

      // Internal database fields (not applicable for external foods)
      id: undefined,
      created_at: undefined,
      updated_at: undefined,
      user_id: undefined,
    };
  }

  /**
   * Extract key nutrients from FDC nutrient array
   */
  private extractNutrients(
    foodNutrients: Array<{
      nutrientId: number;
      value: number;
      unitName: string;
    }>
  ): { calories: number; protein: number; carbs: number; fat: number } {
    const nutrients = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    };

    for (const nutrient of foodNutrients) {
      switch (nutrient.nutrientId) {
        case FDC_NUTRIENT_IDS.ENERGY:
          nutrients.calories = this.convertToStandardUnit(
            nutrient.value,
            nutrient.unitName,
            "kcal"
          );
          break;
        case FDC_NUTRIENT_IDS.PROTEIN:
          nutrients.protein = this.convertToStandardUnit(
            nutrient.value,
            nutrient.unitName,
            "g"
          );
          break;
        case FDC_NUTRIENT_IDS.CARBOHYDRATE:
          nutrients.carbs = this.convertToStandardUnit(
            nutrient.value,
            nutrient.unitName,
            "g"
          );
          break;
        case FDC_NUTRIENT_IDS.FAT:
          nutrients.fat = this.convertToStandardUnit(
            nutrient.value,
            nutrient.unitName,
            "g"
          );
          break;
      }
    }

    return nutrients;
  }

  /**
   * Convert nutrient values to standard units
   */
  private convertToStandardUnit(
    value: number,
    fromUnit: string,
    toUnit: string
  ): number {
    // Most FDC values are already in the right units, but handle common conversions
    if (fromUnit.toLowerCase() === toUnit.toLowerCase()) {
      return Math.round(value * 100) / 100; // Round to 2 decimal places
    }

    // Handle kJ to kcal conversion for energy
    if (fromUnit.toLowerCase() === "kj" && toUnit.toLowerCase() === "kcal") {
      return Math.round((value / 4.184) * 100) / 100;
    }

    // Handle mg to g conversion
    if (fromUnit.toLowerCase() === "mg" && toUnit.toLowerCase() === "g") {
      return Math.round((value / 1000) * 100) / 100;
    }

    // Default: return value as-is
    return Math.round(value * 100) / 100;
  }

  /**
   * Determine appropriate serving size from FDC data
   */
  private determineServingSize(food: FDCFoodData): {
    size: number;
    unit: string;
  } {
    // Check if there's a serving size specified
    if (food.servingSize && food.servingSizeUnit) {
      return {
        size: food.servingSize,
        unit: food.servingSizeUnit,
      };
    }

    // Check food portions for common serving sizes
    if (food.foodPortions && food.foodPortions.length > 0) {
      const commonPortions = food.foodPortions
        .filter((portion) => portion.gramWeight && portion.gramWeight > 0)
        .sort(
          (a, b) => Math.abs(a.gramWeight - 100) - Math.abs(b.gramWeight - 100)
        ); // Prefer portions close to 100g

      if (commonPortions.length > 0) {
        const portion = commonPortions[0];
        return {
          size: portion.gramWeight,
          unit: "g",
        };
      }
    }

    // Default to 100g serving
    return {
      size: 100,
      unit: "g",
    };
  }

  /**
   * Create brand information from FDC data
   */
  private createBrandInfo(food: FDCFoodData): string | undefined {
    if (food.brandName && food.brandOwner) {
      return `${food.brandName} (${food.brandOwner})`;
    }

    if (food.brandName) {
      return food.brandName;
    }

    if (food.brandOwner) {
      return food.brandOwner;
    }

    return undefined;
  }

  /**
   * Clean and format food names from FDC descriptions
   */
  private cleanFoodName(description: string): string {
    // Remove common FDC formatting artifacts
    let cleaned = description
      .replace(/,\s*UPC:\s*\d+/gi, "") // Remove UPC codes
      .replace(/,\s*GTIN:\s*\d+/gi, "") // Remove GTIN codes
      .replace(/\s*\([^)]*\)\s*$/, "") // Remove trailing parentheses
      .trim();

    // Capitalize first letter
    if (cleaned.length > 0) {
      cleaned =
        cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
    }

    return cleaned || "Unknown Food";
  }

  /**
   * Validate the API key
   */
  async validateApiKey(): Promise<boolean> {
    try {
      return await this.client.validateApiKey();
    } catch {
      return false;
    }
  }
}
