import { NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";

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
            const supabase = await createClient();

    const data = await request.json();
    const {data: foodEntry, error} = await supabase
      .from("food_entries")
      .update(data)
      .eq("id", Number(foodEntryId))
      .select()
      .single();

    return NextResponse.json(foodEntry, { status: 200 });
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
            const supabase = await createClient();

    if (!foodEntryId) {
      return NextResponse.json(
        { error: "Food entry ID is required" },
        { status: 400 }
      );
    }

    const {data: foodEntry, error} = await supabase
      .from("food_entries")
      .delete()
      .eq("id", Number(foodEntryId))
      .select()
      .single();

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
