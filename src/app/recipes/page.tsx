"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import RecipeCard from "@/components/recipe-card";
import CategoryList from "@/components/category-list";
import { MealSummary } from "@/lib/types";

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const [meals, setMeals] = useState<MealSummary[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!category) return;
    setLoading(true);
    fetch(`/api/recipes/category/${encodeURIComponent(category)}`)
      .then((res) => res.json())
      .then((data) => setMeals(data.meals || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {category ? (
        <div>
          <h1 className="mb-6 text-3xl font-bold text-gray-900">{category} Recipes</h1>
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-60 animate-pulse rounded-xl bg-gray-200" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {meals.map((meal) => (
                <RecipeCard
                  key={meal.idMeal}
                  id={meal.idMeal}
                  name={meal.strMeal}
                  thumbnail={meal.strMealThumb}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <h1 className="mb-6 text-3xl font-bold text-gray-900">Browse Categories</h1>
          <CategoryList />
        </div>
      )}
    </div>
  );
}
