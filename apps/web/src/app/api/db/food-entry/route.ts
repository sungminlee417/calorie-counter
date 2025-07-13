import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";
import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";

import { Food, FoodEntry, FoodEntryWithFood } from "@calorie-counter/sequelize";

dayjs.extend(utc);

export async function GET(
  request: NextRequest
): Promise<
  | NextResponse<FoodEntryWithFood[]>
  | NextResponse<{ error: string; details: string }>
> {
  try {
    const url = new URL(request.url);
    const dateParam = url.searchParams.get("date");

    const whereClause = dateParam
      ? {
          date: {
            [Op.gte]: dayjs(dateParam).startOf("day").utc().toDate(),
            [Op.lt]: dayjs(dateParam)
              .add(1, "day")
              .startOf("day")
              .utc()
              .toDate(),
          },
        }
      : {};

    const foodEntries = await FoodEntry.findAll({
      where: whereClause,
      include: [
        {
          model: Food,
          as: "food",
        },
      ],
    });

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
