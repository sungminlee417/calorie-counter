import { FoodEntry } from "@calorie-counter/sequelize";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const foodEntries = await FoodEntry.findAll();

    return NextResponse.json(
      foodEntries.map((foodEntry) => foodEntry.toJSON()),
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      {
        error: "Failed to fetch food entries",
        details: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const foodEntry = await FoodEntry.create(data);

    return NextResponse.json(foodEntry.toJSON(), { status: 201 });
  } catch (e) {
    return NextResponse.json(
      {
        error: "Failed to create food entry",
        details: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
