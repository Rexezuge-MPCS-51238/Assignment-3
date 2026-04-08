import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("saved_recipes")
    .select("*")
    .eq("user_id", userId)
    .order("saved_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ favorites: data });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { meal_id, meal_name, meal_thumb, category, area } = body;

  if (!meal_id || !meal_name) {
    return NextResponse.json({ error: "meal_id and meal_name are required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("saved_recipes")
    .upsert(
      { user_id: userId, meal_id, meal_name, meal_thumb, category, area },
      { onConflict: "user_id,meal_id" }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ favorite: data }, { status: 201 });
}
