import { Food } from "@/types/supabase";
import { EnhancedFood, FoodSourceType } from "@/types/food-provider";

/**
 * Convert a standard Food to EnhancedFood
 */
export function foodToEnhanced(food: Food): EnhancedFood {
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
    external_id: undefined,
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
 * Convert an EnhancedFood to standard Food (for internal foods only)
 */
export function enhancedToFood(enhancedFood: EnhancedFood): Food {
  if (enhancedFood.source !== FoodSourceType.INTERNAL) {
    throw new Error("Cannot convert external food to internal Food type");
  }

  return {
    id: enhancedFood.id || 0,
    name: enhancedFood.name,
    brand: enhancedFood.brand || null,
    serving_size: enhancedFood.serving_size || 0,
    serving_unit: enhancedFood.serving_unit || "g",
    calories: enhancedFood.calories,
    protein: enhancedFood.protein,
    carbs: enhancedFood.carbs,
    fat: enhancedFood.fat,
    created_at: enhancedFood.created_at || null,
    updated_at: enhancedFood.updated_at || null,
    user_id: enhancedFood.user_id || "",
  };
}

/**
 * Check if a food item is from an external source
 */
export function isExternalFood(food: EnhancedFood): boolean {
  return food.source !== FoodSourceType.INTERNAL;
}

/**
 * Get a human-readable source name
 */
export function getSourceDisplayName(source: FoodSourceType): string {
  switch (source) {
    case FoodSourceType.INTERNAL:
      return "Personal Database";
    case FoodSourceType.FDC_USDA:
      return "USDA Food Database";
    default:
      return "Unknown Source";
  }
}

/**
 * Create an empty enhanced food for forms
 */
export function createEmptyEnhancedFood(): EnhancedFood {
  return {
    name: "",
    brand: undefined,
    serving_size: 0,
    serving_unit: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    source: FoodSourceType.INTERNAL,
    external_id: undefined,
    provider_metadata: undefined,
    id: undefined,
    created_at: undefined,
    updated_at: undefined,
    user_id: undefined,
  };
}
