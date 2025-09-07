import z from "zod/v4";

// Food source types
export enum FoodSourceType {
  INTERNAL = "internal",
  FDC_USDA = "fdc_usda",
  // Future providers can be added here
  // SPOONACULAR = "spoonacular",
  // NUTRITIONIX = "nutritionix",
}

// Food schema with source metadata
export const foodSchema = z.object({
  // Core food properties (from existing schema)
  name: z.string().min(1).describe("The common name or title of the food item"),
  brand: z
    .string()
    .optional()
    .describe("The manufacturer or brand name associated with the food item"),
  serving_size: z
    .number()
    .positive()
    .describe("The numeric value of a single serving"),
  serving_unit: z
    .string()
    .min(1)
    .describe("The unit of measurement for the serving size"),
  calories: z
    .number()
    .nonnegative()
    .describe("Energy content in one serving, measured in kilocalories"),
  protein: z
    .number()
    .nonnegative()
    .describe("Protein content in one serving, in grams"),
  carbs: z
    .number()
    .nonnegative()
    .describe("Total carbohydrates in one serving, in grams"),
  fat: z.number().nonnegative().describe("Total fat in one serving, in grams"),

  // Source metadata
  source: z
    .enum(Object.values(FoodSourceType) as [string, ...string[]])
    .describe("The provider source of this food item"),
  external_id: z
    .string()
    .optional()
    .describe("The ID of this food in the external provider's system"),
  provider_metadata: z
    .record(z.string(), z.unknown())
    .optional()
    .describe("Additional metadata specific to the provider"),

  // Internal database fields (optional for external foods)
  id: z.number().optional().describe("Internal database ID"),
  created_at: z.string().nullable().optional().describe("Creation timestamp"),
  updated_at: z
    .string()
    .nullable()
    .optional()
    .describe("Last update timestamp"),
  user_id: z.string().optional().describe("User who created this food item"),
});

export type Food = z.infer<typeof foodSchema>;

// Pagination metadata interface
export interface PaginationMetadata {
  page: number;
  pageSize: number;
  totalItems?: number;
  totalPages?: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Unified response format for all providers
export interface FoodProviderResponse {
  foods: Food[];
  pagination: PaginationMetadata;
  source: FoodSourceType;
}

// Search options interface
export interface FoodSearchOptions {
  query?: string;
  page?: number;
  pageSize?: number;
  // Provider-specific options
  filters?: Record<string, unknown>;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Provider configuration interface
export interface FoodProviderConfig {
  enabled: boolean;
  priority: number; // Higher number = higher priority in results
  rateLimit?: {
    requestsPerMinute: number;
    requestsPerDay?: number;
  };
  cache?: {
    ttl: number; // Time to live in milliseconds
  };
}

// Error types for provider operations
export class FoodProviderError extends Error {
  constructor(
    message: string,
    public provider: FoodSourceType,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "FoodProviderError";
  }
}

// FDC specific types
export interface FDCFoodData {
  fdcId: number;
  description: string;
  brandOwner?: string;
  brandName?: string;
  servingSize?: number;
  servingSizeUnit?: string;
  foodNutrients: Array<{
    nutrientId: number;
    nutrientName: string;
    nutrientNumber: string;
    unitName: string;
    value: number;
  }>;
  foodPortions?: Array<{
    id: number;
    portionDescription: string;
    gramWeight: number;
  }>;
}

export interface FDCSearchResponse {
  foods: FDCFoodData[];
  totalHits: number;
  currentPage: number;
  totalPages: number;
}

// Nutrient mapping for FDC API
export const FDC_NUTRIENT_IDS = {
  ENERGY: 1008, // Energy (kcal)
  PROTEIN: 1003, // Protein
  CARBOHYDRATE: 1005, // Carbohydrate, by difference
  FAT: 1004, // Total lipid (fat)
} as const;
