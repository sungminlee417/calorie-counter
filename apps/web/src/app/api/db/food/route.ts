import { NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";


export async function GET() {
  try {
    const supabase = await createClient();
    const { data: foods, error} = await supabase.from("foods").select("*");

    return NextResponse.json(
      foods,
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
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const data = await request.json();

    const {data: food, error} = await supabase.from("foods").insert(data).select().single();

    return NextResponse.json(food, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      {
        error: "Failed to create food",
        details: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
