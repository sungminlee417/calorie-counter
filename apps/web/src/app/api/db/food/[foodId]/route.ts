import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export interface RouteParams {
  params: {
    foodId: string;
  };
}

export const PATCH = async (
  request: Request,
  { params: { foodId } }: RouteParams
) => {
  try {
        const supabase = await createClient();

    const data = await request.json();
    const {data: food, error} = await supabase
      .from("foods")
      .update(data)
      .eq("id", Number(foodId))
      .select()
      .single();

    if (food) {
      return NextResponse.json(
        { error: "Food not found or no changes made" },
        { status: 404 }
      );
    }

    return NextResponse.json(food, { status: 200 });
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

export const DELETE = async (
  request: Request,
  { params: { foodId } }: RouteParams
) => {
  try {
        const supabase = await createClient();

    if (!foodId) {
      return NextResponse.json(
        { error: "Food ID is required" },
        { status: 400 }
      );
    }

    const {data: food, error} = await supabase
      .from("foods")
      .delete()
      .eq("id", Number(foodId))
      .select()
      .single();

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
