"use client";

import { useState } from "react";
import SearchBar from "@/components/search-bar";
import RecipeCard from "@/components/recipe-card";
import CategoryList from "@/components/category-list";
import { MealSummary } from "@/lib/types";

export default function Home() {
  const [results, setResults] = useState<MealSummary[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSearch(query: string) {
    setLoading(true);
    setSearched(true);
    const res = await fetch(`/api/recipes/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data.meals || []);
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-bold text-gray-900">Find Your Next Meal</h1>
        <p className="mb-6 text-lg text-gray-600">
          Search thousands of recipes or browse by category
        </p>
        <div className="flex justify-center">
          <SearchBar onSearch={handleSearch} isLoading={loading} />
        </div>
      </div>

      {searched ? (
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            {loading
              ? "Searching..."
              : results.length > 0
              ? `Found ${results.length} recipe${results.length === 1 ? "" : "s"}`
              : "No recipes found"}
          </h2>
          {!loading && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {results.map((meal) => (
                <RecipeCard
                  key={meal.idMeal}
                  id={meal.idMeal}
                  name={meal.strMeal}
                  thumbnail={meal.strMealThumb}
                  category={meal.strCategory}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Browse by Category</h2>
          <CategoryList />
        </div>
      )}
    </div>
  );
}
