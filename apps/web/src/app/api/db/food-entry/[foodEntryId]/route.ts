import { FoodEntry } from "@calorie-counter/sequelize";
import { NextResponse } from "next/server";

export interface RouteParams {
  params: {
    foodEntryId: string;
  };
}

export const PATCH = async (
  request: Request,
  { params: { foodEntryId } }: RouteParams
) => {
  try {
    const data = await request.json();
    const foodEntry = await FoodEntry.update(data, {
      where: { id: foodEntryId },
      returning: true,
    });

    if (foodEntry[0] === 0) {
      return NextResponse.json(
        { error: "Food entry not found or no changes made" },
        { status: 404 }
      );
    }

    return NextResponse.json(foodEntry[1][0].toJSON(), { status: 200 });
  } catch (e) {
    return NextResponse.json(
      {
        error: "Failed to update food entry",
        details: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  request: Request,
  { params: { foodEntryId } }: RouteParams
) => {
  try {
    if (!foodEntryId) {
      return NextResponse.json(
        { error: "Food entry ID is required" },
        { status: 400 }
      );
    }

    const deletedCount = await FoodEntry.destroy({
      where: { id: foodEntryId },
    });

    if (deletedCount === 0) {
      return NextResponse.json(
        { error: "Food entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Food entry deleted successfully" },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      {
        error: "Failed to delete food entry",
        details: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};
