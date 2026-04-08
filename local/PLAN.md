# Recipe Finder - Implementation Plan

## Context
MPCS 51238 Assignment 3: Build a full-stack Recipe Finder app using Next.js + Tailwind, Clerk auth, Supabase database, and TheMealDB API. Users search/browse recipes and save favorites. No stretch goals.

## File Structure
```
src/
  middleware.ts                          # Clerk auth middleware
  app/
    globals.css
    layout.tsx                           # ClerkProvider + Navbar
    page.tsx                             # Home: search + category grid
    sign-in/[[...sign-in]]/page.tsx
    sign-up/[[...sign-up]]/page.tsx
    recipes/page.tsx                     # Browse by category
    recipe/[id]/page.tsx                 # Recipe detail (server component)
    favorites/page.tsx                   # Saved recipes (protected)
    api/
      recipes/search/route.ts            # GET ?q=chicken
      recipes/categories/route.ts        # GET all categories
      recipes/category/[name]/route.ts   # GET meals in category
      recipes/[id]/route.ts              # GET meal detail
      favorites/route.ts                 # GET + POST saved recipes
      favorites/[id]/route.ts            # DELETE saved recipe
  components/
    navbar.tsx
    recipe-card.tsx
    favorite-button.tsx
    search-bar.tsx
    category-list.tsx
  lib/
    types.ts
    supabase.ts
    mealdb.ts
```

## Supabase Table: `saved_recipes`
| Column     | Type          | Notes                               |
|------------|---------------|-------------------------------------|
| id         | UUID (PK)     | DEFAULT gen_random_uuid()           |
| user_id    | TEXT NOT NULL  | Clerk user ID                       |
| meal_id    | TEXT NOT NULL  | TheMealDB idMeal                    |
| meal_name  | TEXT NOT NULL  | Cached for display                  |
| meal_thumb | TEXT          | Cached thumbnail URL                |
| category   | TEXT          | Cached category                     |
| area       | TEXT          | Cached cuisine area                 |
| saved_at   | TIMESTAMPTZ   | DEFAULT NOW()                       |
|            | UNIQUE        | (user_id, meal_id)                  |

No RLS -- user scoping enforced server-side via `WHERE user_id = clerkUserId`.

## Pre-requisite: Create Clerk + Supabase Projects

### Supabase Setup (do this first)
1. Go to https://supabase.com and sign up / log in
2. Click "New Project", pick a name (e.g. "recipe-finder"), set a DB password, choose a region
3. Once created, go to **Settings > API** and copy:
   - **Project URL** -> `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Configure Supabase MCP in Claude Code:
   ```
   claude mcp add --transport http supabase https://mcp.supabase.com/mcp
   ```
5. The `saved_recipes` table will be created via SQL in Phase 2

### Clerk Setup
1. Go to https://clerk.com and sign up / log in
2. Click "Create application", name it (e.g. "Recipe Finder")
3. Choose sign-in methods (Email + Google recommended)
4. From the Clerk dashboard, copy:
   - **Publishable Key** -> `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Secret Key** -> `CLERK_SECRET_KEY`

### Connect Clerk + Supabase (after both are created)
1. In Clerk dashboard: go to **Integrations > Supabase** and click "Connect with Supabase"
2. In Supabase dashboard: go to **Auth > Third-Party Auth > Add Clerk** and paste the Clerk issuer URL

## Phases

### Phase 1: Scaffold
- `npx create-next-app@latest .` (TypeScript, Tailwind, App Router, src/ dir)
- Create `CLAUDE.md` with project description and data model
- Add TheMealDB remote pattern to `next.config.ts` for next/image
- **Commit**: "Scaffold Next.js app with Tailwind and TypeScript"

### Phase 2: Supabase Setup
- `npm install @supabase/supabase-js`
- Create `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Create `src/lib/supabase.ts` -- createClient helper
- Create `saved_recipes` table in Supabase (via MCP or manually)
- **Commit**: "Set up Supabase client and saved_recipes table"

### Phase 3: Clerk Auth
- `npm install @clerk/nextjs`
- Add Clerk keys to `.env.local`
- Create `src/middleware.ts` -- protect `/favorites` and `/api/favorites` routes
- Wrap root layout with `<ClerkProvider>`
- Create sign-in and sign-up catch-all pages with Clerk components
- **Commit**: "Set up Clerk authentication"

### Phase 4: Types + TheMealDB Helpers
- `src/lib/types.ts` -- MealSummary, MealDetail, MealCategory, SavedRecipe
- `src/lib/mealdb.ts` -- searchMeals, getCategories, getMealsByCategory, getMealById
- Parse strIngredient1-20 / strMeasure1-20 into clean array
- Handle `{ meals: null }` responses
- **Commit**: "Add TypeScript types and TheMealDB API helpers"

### Phase 5: API Routes
- 4 public recipe routes (search, categories, category filter, detail)
- 2 protected favorites routes (GET+POST, DELETE)
- Favorites use `auth()` from `@clerk/nextjs/server` to get userId
- POST uses `ON CONFLICT (user_id, meal_id) DO NOTHING`
- **Commit**: "Add API routes for recipes and favorites"

### Phase 6: Components
- `navbar.tsx` -- links (Home, Browse, Favorites), Clerk UserButton/SignInButton
- `search-bar.tsx` -- controlled input, fetches /api/recipes/search
- `recipe-card.tsx` -- thumbnail, name, category badge, link to detail
- `favorite-button.tsx` -- heart toggle, POST/DELETE to /api/favorites
- `category-list.tsx` -- grid of category cards linking to browse
- **Commit**: "Add UI components"

### Phase 7: Pages
- Home (`page.tsx`) -- hero, SearchBar, results or category grid
- Browse (`recipes/page.tsx`) -- category grid or meals in selected category
- Detail (`recipe/[id]/page.tsx`) -- server component, full recipe with FavoriteButton
- Favorites (`favorites/page.tsx`) -- protected, grid of saved recipes
- **Commit**: "Build all pages"

### Phase 8: Polish
- Loading states (skeletons/spinners)
- Error handling (API down, no results)
- Verify full flow: search -> detail -> save -> favorites
- **Commit**: "Polish UI with loading and error states"

### Phase 9: Deploy
- Push to GitHub
- Connect to Vercel, set all env vars
- Add Vercel URL to Clerk allowed origins
- Test live URL end-to-end

## Key Design Decisions
1. **Server-side API proxy**: TheMealDB called from API routes, not browser (assignment requirement)
2. **Cached fields in saved_recipes**: Avoids N API calls to render favorites grid
3. **Server component for detail page**: Fetch directly via mealdb.ts, embed FavoriteButton as client island
4. **No Supabase RLS**: Simpler -- user scoping via explicit WHERE clauses in API routes

## Verification
1. `npm run dev` -- app starts without errors
2. Search for "chicken" on home page -- results appear
3. Click a category -- meals load
4. Click a meal -- detail page with ingredients and instructions
5. Sign up via Clerk -- redirects back to app
6. Save a recipe -- heart fills, appears in /favorites
7. Sign out and back in -- favorites persist
8. `npm run build` -- no build errors
9. Deploy to Vercel -- live URL works for classmates
