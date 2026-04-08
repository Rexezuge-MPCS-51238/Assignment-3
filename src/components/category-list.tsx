"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MealCategory } from "@/lib/types";

export default function CategoryList() {
  const [categories, setCategories] = useState<MealCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/recipes/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-xl bg-gray-200" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {categories.map((cat) => (
        <Link
          key={cat.idCategory}
          href={`/recipes?category=${encodeURIComponent(cat.strCategory)}`}
          className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={cat.strCategoryThumb}
              alt={cat.strCategory}
              fill
              className="object-cover transition group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
          <div className="p-3 text-center">
            <h3 className="font-semibold text-gray-900">{cat.strCategory}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
}
