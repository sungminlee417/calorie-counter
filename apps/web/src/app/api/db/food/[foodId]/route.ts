import { Food } from "@calorie-counter/sequelize";
import { NextResponse } from "next/server";

export interface RouteParams {
  foodId: string;
}

export const PATCH = async (request: Request, { foodId }: RouteParams) => {
  try {
    const data = await request.json();
    const food = await Food.update(data, {
      where: { id: foodId },
      returning: true,
    });

    if (food[0] === 0) {
      return NextResponse.json(
        { error: "Food not found or no changes made" },
        { status: 404 }
      );
    }

    return NextResponse.json(food[1][0].toJSON(), { status: 200 });
  } catch (e) {
    return NextResponse.json(
      {
        error: "Failed to update food",
        details: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};

export const DELETE = async (request: Request, { foodId }: RouteParams) => {
  try {
    if (!foodId) {
      return NextResponse.json(
        { error: "Food ID is required" },
        { status: 400 }
      );
    }

    const deletedCount = await Food.destroy({ where: { id: foodId } });

    if (deletedCount === 0) {
      return NextResponse.json({ error: "Food not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Food deleted successfully" },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      {
        error: "Failed to delete food",
        details: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};
