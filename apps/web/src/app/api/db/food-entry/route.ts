import {  NextResponse } from "next/server";
import { Op } from "sequelize";
import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";

import { createClient } from "@/utils/supabase/server";

dayjs.extend(utc);

export const GET = (async (request: Request) => {
          const supabase = await createClient();

  const url = new URL(request.url);
  const dateParam = url.searchParams.get("date");

  const dateFilter = dateParam
    ? {
        date: {
          [Op.gte]: dayjs(dateParam).startOf("day").utc().toDate(),
          [Op.lt]: dayjs(dateParam).add(1, "day").utc().toDate(),
        },
      }
    : {};

  const whereClause = {
    ...dateFilter,
  };

  const { data: foodEntries, error } = await supabase
    .from("food_entries")
    .select("*")
    .match(whereClause);

  return NextResponse.json(
    foodEntries,
    { status: 200 }
  );
});

export async function POST(request: Request) {
  try {
        const supabase = await createClient();

    const data = await request.json();
    const { data: foodEntry, error } = await supabase
      .from("food_entries")
      .insert(data)
      .select()
      .single();

    return NextResponse.json(foodEntry, { status: 201 });
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
