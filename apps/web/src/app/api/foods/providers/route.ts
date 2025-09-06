import { NextResponse } from "next/server";
import { FoodSourceType } from "@/types/food-provider";

export async function GET() {
  try {
    const availableProviders = [FoodSourceType.INTERNAL]; // Always available
    const providerStatus = {
      [FoodSourceType.INTERNAL]: {
        available: true,
        enabled: true,
        description: "Personal food database",
      },
      [FoodSourceType.FDC_USDA]: {
        available: !!process.env.FDC_API_KEY,
        enabled: !!process.env.FDC_API_KEY,
        description: "USDA Food Data Central",
        requiresApiKey: true,
      },
    };

    if (process.env.FDC_API_KEY) {
      availableProviders.push(FoodSourceType.FDC_USDA);
    }

    return NextResponse.json({
      availableProviders,
      providerStatus,
      totalProviders: availableProviders.length,
    });
  } catch (error) {
    console.error("Provider status check failed:", error);
    return NextResponse.json(
      { error: "Failed to check provider status" },
      { status: 500 }
    );
  }
}
