"use client";

import { useState, useEffect } from "react";
import RecipeCard from "@/components/recipe-card";
import { SavedRecipe } from "@/lib/types";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<SavedRecipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/favorites")
      .then((res) => res.json())
      .then((data) => setFavorites(data.favorites || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">My Favorites</h1>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-60 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <p className="text-gray-600">
          You haven&apos;t saved any recipes yet. Search for recipes and click the
          save button to add them here!
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {favorites.map((fav) => (
            <RecipeCard
              key={fav.id}
              id={fav.meal_id}
              name={fav.meal_name}
              thumbnail={fav.meal_thumb || "/globe.svg"}
              category={fav.category || undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
