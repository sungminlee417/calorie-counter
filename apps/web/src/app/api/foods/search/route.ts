import { NextRequest, NextResponse } from "next/server";
import { FDCApiClient } from "@/lib/food-providers/fdc-api-client";
import {
  FoodSourceType,
  EnhancedFood,
  FoodProviderResponse,
  PaginationMetadata,
  FDC_NUTRIENT_IDS,
} from "@/types/food-provider";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      query = "",
      page = 1,
      pageSize = 25,
      providers = [FoodSourceType.INTERNAL, FoodSourceType.FDC_USDA],
      enableDeduplication = true,
    } = body;

    // Validate request
    if (pageSize > 100) {
      return NextResponse.json(
        { error: "Page size cannot exceed 100" },
        { status: 400 }
      );
    }

    const results: FoodProviderResponse[] = [];

    // Search internal database
    if (providers.includes(FoodSourceType.INTERNAL)) {
      try {
        const supabase = await createClient();

        // Check if user is authenticated
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();
        console.log("API Route - User:", user?.id, "Auth Error:", authError);

        const offset = (page - 1) * Math.min(pageSize, 15);
        const limit = Math.min(pageSize, 15);
        const from = offset;
        const to = offset + limit - 1;

        let supabaseQuery = supabase
          .from("foods")
          .select("*")
          .order("created_at", { ascending: false })
          .range(from, to);

        if (query.trim() !== "") {
          supabaseQuery = supabaseQuery.ilike("name", `%${query.trim()}%`);
        }

        const { data: foods, error } = await supabaseQuery;

        if (error) {
          throw new Error(error.message);
        }

        const enhancedFoods: EnhancedFood[] = (foods || []).map((food) => ({
          name: food.name,
          brand: food.brand || undefined,
          serving_size: food.serving_size || 0,
          serving_unit: food.serving_unit || "g",
          calories: food.calories || 0,
          protein: food.protein || 0,
          carbs: food.carbs || 0,
          fat: food.fat || 0,
          source: FoodSourceType.INTERNAL,
          external_id: undefined,
          provider_metadata: { internalId: food.id },
          id: food.id,
          created_at: food.created_at || undefined,
          updated_at: food.updated_at || undefined,
          user_id: food.user_id,
        }));

        results.push({
          foods: enhancedFoods,
          pagination: {
            page,
            pageSize: Math.min(pageSize, 15),
            hasNextPage: (foods || []).length === Math.min(pageSize, 15),
            hasPreviousPage: page > 1,
          },
          source: FoodSourceType.INTERNAL,
        });
      } catch (error) {
        console.warn("Internal food search failed:", error);
      }
    }

    // Search FDC database
    if (
      providers.includes(FoodSourceType.FDC_USDA) &&
      process.env.FDC_API_KEY &&
      query.trim()
    ) {
      try {
        const fdcClient = new FDCApiClient(process.env.FDC_API_KEY);
        const fdcResponse = await fdcClient.searchFoods({
          query,
          pageNumber: page,
          pageSize: Math.min(pageSize, 25),
        });

        const enhancedFoods: EnhancedFood[] = fdcResponse.foods.map((food) => {
          // Extract nutrients
          const nutrients = {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
          };

          for (const nutrient of food.foodNutrients || []) {
            switch (nutrient.nutrientId) {
              case FDC_NUTRIENT_IDS.ENERGY:
                nutrients.calories =
                  Math.round((nutrient.value || 0) * 100) / 100;
                break;
              case FDC_NUTRIENT_IDS.PROTEIN:
                nutrients.protein =
                  Math.round((nutrient.value || 0) * 100) / 100;
                break;
              case FDC_NUTRIENT_IDS.CARBOHYDRATE:
                nutrients.carbs = Math.round((nutrient.value || 0) * 100) / 100;
                break;
              case FDC_NUTRIENT_IDS.FAT:
                nutrients.fat = Math.round((nutrient.value || 0) * 100) / 100;
                break;
            }
          }

          // Determine serving size
          const servingSize = food.servingSize || 100;
          const servingUnit = food.servingSizeUnit || "g";

          // Create brand info
          let brand: string | undefined;
          if (food.brandName && food.brandOwner) {
            brand = `${food.brandName} (${food.brandOwner})`;
          } else if (food.brandName) {
            brand = food.brandName;
          } else if (food.brandOwner) {
            brand = food.brandOwner;
          }

          return {
            name: cleanFoodName(food.description || "Unknown Food"),
            brand,
            serving_size: servingSize,
            serving_unit: servingUnit,
            calories: nutrients.calories,
            protein: nutrients.protein,
            carbs: nutrients.carbs,
            fat: nutrients.fat,
            source: FoodSourceType.FDC_USDA,
            external_id: food.fdcId?.toString(),
            provider_metadata: {
              fdcId: food.fdcId,
              brandOwner: food.brandOwner,
              brandName: food.brandName,
              originalDescription: food.description,
            },
            id: undefined,
            created_at: undefined,
            updated_at: undefined,
            user_id: undefined,
          };
        });

        results.push({
          foods: enhancedFoods,
          pagination: {
            page: fdcResponse.currentPage,
            pageSize: Math.min(pageSize, 25),
            totalItems: fdcResponse.totalHits,
            totalPages: fdcResponse.totalPages,
            hasNextPage: fdcResponse.currentPage < fdcResponse.totalPages,
            hasPreviousPage: fdcResponse.currentPage > 1,
          },
          source: FoodSourceType.FDC_USDA,
        });
      } catch (error) {
        console.warn("FDC food search failed:", error);
      }
    }

    // Merge results
    const allFoods: EnhancedFood[] = [];
    for (const result of results) {
      allFoods.push(...result.foods);
    }

    // Apply deduplication if enabled
    let finalFoods = allFoods;
    if (enableDeduplication && allFoods.length > 1) {
      finalFoods = deduplicateFoods(allFoods);
    }

    // Sort by relevance (internal foods first, then by name)
    finalFoods.sort((a, b) => {
      if (
        a.source === FoodSourceType.INTERNAL &&
        b.source !== FoodSourceType.INTERNAL
      ) {
        return -1;
      }
      if (
        b.source === FoodSourceType.INTERNAL &&
        a.source !== FoodSourceType.INTERNAL
      ) {
        return 1;
      }
      return a.name.localeCompare(b.name);
    });

    // Apply pagination to merged results
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedFoods = finalFoods.slice(startIndex, endIndex);

    const pagination: PaginationMetadata = {
      page,
      pageSize,
      totalItems: finalFoods.length,
      totalPages: Math.ceil(finalFoods.length / pageSize),
      hasNextPage: endIndex < finalFoods.length,
      hasPreviousPage: page > 1,
    };

    return NextResponse.json({
      foods: paginatedFoods,
      pagination,
      source: "aggregated" as const,
      stats: {
        totalResults: finalFoods.length,
        sourceBreakdown: finalFoods.reduce(
          (acc, food) => {
            acc[food.source] = (acc[food.source] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        ),
      },
    });
  } catch (error) {
    console.error("Food search API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper functions
function cleanFoodName(description: string): string {
  let cleaned = description
    .replace(/,\s*UPC:\s*\d+/gi, "")
    .replace(/,\s*GTIN:\s*\d+/gi, "")
    .replace(/\s*\([^)]*\)\s*$/, "")
    .trim();

  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
  }

  return cleaned || "Unknown Food";
}

function deduplicateFoods(foods: EnhancedFood[]): EnhancedFood[] {
  const deduplicated: EnhancedFood[] = [];
  const threshold = 0.8;

  for (const candidate of foods) {
    const isDuplicate = deduplicated.some(
      (existing) =>
        calculateFoodSimilarity(candidate.name, existing.name) >= threshold
    );

    if (!isDuplicate) {
      deduplicated.push(candidate);
    } else {
      // If it's a duplicate but from internal source, prefer internal
      const existingIndex = deduplicated.findIndex(
        (existing) =>
          calculateFoodSimilarity(candidate.name, existing.name) >= threshold
      );

      if (
        existingIndex !== -1 &&
        candidate.source === FoodSourceType.INTERNAL &&
        deduplicated[existingIndex].source !== FoodSourceType.INTERNAL
      ) {
        deduplicated[existingIndex] = candidate;
      }
    }
  }

  return deduplicated;
}

function calculateFoodSimilarity(name1: string, name2: string): number {
  const n1 = name1.toLowerCase().trim();
  const n2 = name2.toLowerCase().trim();

  if (n1 === n2) return 1.0;
  if (n1.includes(n2) || n2.includes(n1)) return 0.8;

  const words1 = n1.split(/\s+/);
  const words2 = n2.split(/\s+/);
  const commonWords = words1.filter((word) => words2.includes(word));

  if (commonWords.length === 0) return 0;

  return Math.min(
    (commonWords.length * 2) / (words1.length + words2.length),
    0.9
  );
}
