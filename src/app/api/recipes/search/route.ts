import { NextRequest, NextResponse } from "next/server";
import { searchMeals } from "@/lib/mealdb";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  if (!q.trim()) {
    return NextResponse.json({ meals: [] });
  }
  const meals = await searchMeals(q);
  return NextResponse.json({ meals });
}
