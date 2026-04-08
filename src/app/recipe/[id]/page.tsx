import Image from "next/image";
import { getMealById } from "@/lib/mealdb";
import FavoriteButton from "@/components/favorite-button";
import { notFound } from "next/navigation";

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meal = await getMealById(id);

  if (!meal) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="relative aspect-video">
          <Image
            src={meal.strMealThumb}
            alt={meal.strMeal}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{meal.strMeal}</h1>
              <div className="mt-2 flex gap-2">
                {meal.strCategory && (
                  <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
                    {meal.strCategory}
                  </span>
                )}
                {meal.strArea && (
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                    {meal.strArea}
                  </span>
                )}
              </div>
            </div>
            <FavoriteButton
              mealId={meal.idMeal}
              mealName={meal.strMeal}
              mealThumb={meal.strMealThumb}
              category={meal.strCategory}
              area={meal.strArea}
            />
          </div>

          <div className="mb-6">
            <h2 className="mb-3 text-xl font-semibold text-gray-900">Ingredients</h2>
            <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
              {meal.ingredients.map((ing, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                  <span className="font-medium">{ing.measure}</span> {ing.ingredient}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">Instructions</h2>
            <div className="whitespace-pre-line text-gray-700 leading-relaxed">
              {meal.strInstructions}
            </div>
          </div>

          {meal.strYoutube && (
            <div className="mt-6">
              <a
                href={meal.strYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Watch on YouTube
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
