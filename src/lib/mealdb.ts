import { MealSummary, MealDetail, MealCategory } from "./types";

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

function parseIngredients(
  meal: Record<string, string | null>
): { ingredient: string; measure: string }[] {
  const ingredients: { ingredient: string; measure: string }[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`]?.trim();
    const measure = meal[`strMeasure${i}`]?.trim();
    if (ingredient) {
      ingredients.push({ ingredient, measure: measure || "" });
    }
  }
  return ingredients;
}

export async function searchMeals(query: string): Promise<MealSummary[]> {
  const res = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`);
  const data = await res.json();
  return data.meals || [];
}

export async function getCategories(): Promise<MealCategory[]> {
  const res = await fetch(`${BASE_URL}/categories.php`);
  const data = await res.json();
  return data.categories || [];
}

export async function getMealsByCategory(category: string): Promise<MealSummary[]> {
  const res = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
  const data = await res.json();
  return data.meals || [];
}

export async function getMealById(id: string): Promise<MealDetail | null> {
  const res = await fetch(`${BASE_URL}/lookup.php?i=${encodeURIComponent(id)}`);
  const data = await res.json();
  if (!data.meals || data.meals.length === 0) return null;
  const meal = data.meals[0];
  return {
    idMeal: meal.idMeal,
    strMeal: meal.strMeal,
    strMealThumb: meal.strMealThumb,
    strCategory: meal.strCategory,
    strArea: meal.strArea,
    strInstructions: meal.strInstructions,
    strYoutube: meal.strYoutube,
    strSource: meal.strSource,
    ingredients: parseIngredients(meal),
  };
}
