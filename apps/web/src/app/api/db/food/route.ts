import { Food } from "@calorie-counter/sequelize";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const foods = await Food.findAll();

    return NextResponse.json(
      foods.map((food) => food.toJSON()),
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      {
        error: "Failed to fetch foods",
        details: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};

export const POST = async (request: Request) => {
  try {
    const data = await request.json();
    const food = await Food.create(data);

    return NextResponse.json(food.toJSON(), { status: 201 });
  } catch (e) {
    return NextResponse.json(
      {
        error: "Failed to create food",
        details: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};
