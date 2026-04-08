import { NextRequest, NextResponse } from "next/server";
import { getMealsByCategory } from "@/lib/mealdb";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const meals = await getMealsByCategory(name);
  return NextResponse.json({ meals });
}
