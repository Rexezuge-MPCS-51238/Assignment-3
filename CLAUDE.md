# Recipe Finder

A full-stack recipe finder app built with Next.js + Tailwind CSS, Clerk for auth, Supabase for data, and TheMealDB API.

## Stack
- **Framework**: Next.js (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **Auth**: Clerk
- **Database**: Supabase (PostgreSQL)
- **External API**: TheMealDB (free, no key required)

## Data Model
**saved_recipes** table in Supabase:
- `id` (UUID PK), `user_id` (TEXT), `meal_id` (TEXT), `meal_name` (TEXT)
- `meal_thumb` (TEXT), `category` (TEXT), `area` (TEXT), `saved_at` (TIMESTAMPTZ)
- Unique constraint on (user_id, meal_id)
- User scoping via WHERE clauses in API routes (no RLS)

## Key Patterns
- TheMealDB is called from server-side API routes, not the browser
- Clerk `auth()` protects favorites routes
- Cached fields in saved_recipes avoid N API calls on favorites page
