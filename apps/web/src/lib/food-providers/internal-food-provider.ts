import {
  EnhancedFood,
  FoodProviderResponse,
  FoodSearchOptions,
  FoodSourceType,
  FoodProviderConfig,
  FoodProviderError,
  PaginationMetadata,
} from "@/types/food-provider";
import { BaseFoodProvider } from "./base-food-provider";
import { fetchGetFoods } from "@/lib/supabase/fetch-food";
import { Food } from "@/types/supabase";

/**
 * Food provider for internal Supabase database
 * Wraps existing fetchGetFoods functionality in the new provider interface
 */
export class InternalFoodProvider extends BaseFoodProvider {
  constructor(config?: Partial<FoodProviderConfig>) {
    const defaultConfig: FoodProviderConfig = {
      enabled: true,
      priority: 10, // Higher priority for internal foods
      cache: {
        ttl: 5 * 60 * 1000, // 5 minutes
      },
    };

    super(FoodSourceType.INTERNAL, { ...defaultConfig, ...config });
  }

  async searchFoods(options: FoodSearchOptions): Promise<FoodProviderResponse> {
    try {
      this.validateSearchOptions(options);

      const { query = "", page = 1, pageSize = 10 } = options;

      // Convert page-based pagination to offset-based for Supabase
      const offset = (page - 1) * pageSize;

      // Call existing Supabase function
      const foods = await fetchGetFoods(pageSize, offset, query);

      // Transform to enhanced foods
      const enhancedFoods = foods.map((food) =>
        this.transformToEnhancedFood(food)
      );

      // Create pagination metadata
      const pagination: PaginationMetadata = {
        page,
        pageSize,
        hasNextPage: foods.length === pageSize, // If we got a full page, assume there might be more
        hasPreviousPage: page > 1,
        // Note: Supabase doesn't return total count by default
        // We could implement a separate count query if needed
      };

      return {
        foods: enhancedFoods,
        pagination,
        source: this.sourceType,
      };
    } catch (error) {
      this.handleError(error, "searchFoods");
    }
  }

  async getFoodById(id: string): Promise<EnhancedFood | null> {
    try {
      // We need to add a function to fetch individual foods by ID
      // For now, we'll search with a specific query that might match
      const foods = await fetchGetFoods(1, 0, ""); // This is a limitation of current API

      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        return null;
      }

      const food = foods.find((f) => f.id === numericId);

      if (!food) {
        return null;
      }

      return this.transformToEnhancedFood(food);
    } catch (error) {
      this.handleError(error, "getFoodById");
    }
  }

  /**
   * Transform internal Food type to EnhancedFood
   */
  protected transformToEnhancedFood(food: Food): EnhancedFood {
    return {
      // Core food properties
      name: food.name,
      brand: food.brand || undefined,
      serving_size: food.serving_size || 0,
      serving_unit: food.serving_unit || "g",
      calories: food.calories || 0,
      protein: food.protein || 0,
      carbs: food.carbs || 0,
      fat: food.fat || 0,

      // Source metadata
      source: FoodSourceType.INTERNAL,
      external_id: undefined, // Internal foods don't have external IDs
      provider_metadata: {
        internalId: food.id,
      },

      // Internal database fields
      id: food.id,
      created_at: food.created_at || undefined,
      updated_at: food.updated_at || undefined,
      user_id: food.user_id,
    };
  }

  /**
   * Create a new internal food
   * This wraps the existing create functionality
   */
  async createFood(
    foodData: Omit<
      EnhancedFood,
      "id" | "created_at" | "updated_at" | "source" | "external_id"
    >
  ): Promise<EnhancedFood> {
    try {
      const { fetchCreateFood } = await import("@/lib/supabase/fetch-food");

      // Transform enhanced food back to internal format
      const internalFood: Omit<Food, "id" | "created_at" | "updated_at"> = {
        name: foodData.name,
        brand: foodData.brand || null,
        serving_size: foodData.serving_size,
        serving_unit: foodData.serving_unit,
        calories: foodData.calories,
        protein: foodData.protein,
        carbs: foodData.carbs,
        fat: foodData.fat,
        user_id: foodData.user_id || "", // This should be set by the calling code
      };

      const createdFood = await fetchCreateFood(internalFood);
      return this.transformToEnhancedFood(createdFood);
    } catch (error) {
      this.handleError(error, "createFood");
    }
  }

  /**
   * Update an existing internal food
   */
  async updateFood(foodData: EnhancedFood): Promise<EnhancedFood> {
    try {
      if (!foodData.id) {
        throw new FoodProviderError(
          "Food ID is required for updates",
          this.sourceType,
          "MISSING_ID"
        );
      }

      const { fetchUpdateFood } = await import("@/lib/supabase/fetch-food");

      // Transform enhanced food back to internal format
      const internalFood: Food = {
        id: foodData.id,
        name: foodData.name,
        brand: foodData.brand || null,
        serving_size: foodData.serving_size,
        serving_unit: foodData.serving_unit,
        calories: foodData.calories,
        protein: foodData.protein,
        carbs: foodData.carbs,
        fat: foodData.fat,
        created_at: foodData.created_at || null,
        updated_at: foodData.updated_at || null,
        user_id: foodData.user_id || "",
      };

      const updatedFood = await fetchUpdateFood(internalFood);
      return this.transformToEnhancedFood(updatedFood);
    } catch (error) {
      this.handleError(error, "updateFood");
    }
  }

  /**
   * Delete an internal food
   */
  async deleteFood(id: string): Promise<void> {
    try {
      const { fetchDeleteFood } = await import("@/lib/supabase/fetch-food");
      const numericId = parseInt(id, 10);

      if (isNaN(numericId)) {
        throw new FoodProviderError(
          "Invalid food ID format",
          this.sourceType,
          "INVALID_ID"
        );
      }

      await fetchDeleteFood(numericId);
    } catch (error) {
      this.handleError(error, "deleteFood");
    }
  }
}
