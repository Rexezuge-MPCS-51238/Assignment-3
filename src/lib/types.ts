export interface MealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
}

export interface MealDetail extends MealSummary {
  strInstructions: string;
  strYoutube?: string;
  strSource?: string;
  ingredients: { ingredient: string; measure: string }[];
}

export interface MealCategory {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

export interface SavedRecipe {
  id: string;
  user_id: string;
  meal_id: string;
  meal_name: string;
  meal_thumb: string | null;
  category: string | null;
  area: string | null;
  saved_at: string;
}
