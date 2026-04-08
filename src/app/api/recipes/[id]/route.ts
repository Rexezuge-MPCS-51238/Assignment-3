import { NextRequest, NextResponse } from "next/server";
import { getMealById } from "@/lib/mealdb";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const meal = await getMealById(id);
  if (!meal) {
    return NextResponse.json({ error: "Meal not found" }, { status: 404 });
  }
  return NextResponse.json({ meal });
}
