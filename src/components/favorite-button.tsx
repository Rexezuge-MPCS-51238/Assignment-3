"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

interface FavoriteButtonProps {
  mealId: string;
  mealName: string;
  mealThumb: string;
  category?: string;
  area?: string;
}

export default function FavoriteButton({
  mealId,
  mealName,
  mealThumb,
  category,
  area,
}: FavoriteButtonProps) {
  const { isSignedIn } = useUser();
  const [saved, setSaved] = useState(false);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSignedIn) return;
    fetch("/api/favorites")
      .then((res) => res.json())
      .then((data) => {
        const match = data.favorites?.find(
          (f: { meal_id: string }) => f.meal_id === mealId
        );
        if (match) {
          setSaved(true);
          setFavoriteId(match.id);
        }
      })
      .catch(() => {});
  }, [isSignedIn, mealId]);

  async function toggleFavorite() {
    if (!isSignedIn || loading) return;
    setLoading(true);

    if (saved && favoriteId) {
      const res = await fetch(`/api/favorites/${favoriteId}`, { method: "DELETE" });
      if (res.ok) {
        setSaved(false);
        setFavoriteId(null);
      }
    } else {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meal_id: mealId,
          meal_name: mealName,
          meal_thumb: mealThumb,
          category,
          area,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSaved(true);
        setFavoriteId(data.favorite.id);
      }
    }
    setLoading(false);
  }

  if (!isSignedIn) return null;

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
        saved
          ? "bg-red-100 text-red-700 hover:bg-red-200"
          : "bg-orange-100 text-orange-700 hover:bg-orange-200"
      } disabled:opacity-50`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
      {saved ? "Saved" : "Save"}
    </button>
  );
}
