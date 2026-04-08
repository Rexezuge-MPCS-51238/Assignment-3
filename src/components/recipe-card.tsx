import Image from "next/image";
import Link from "next/link";

interface RecipeCardProps {
  id: string;
  name: string;
  thumbnail: string;
  category?: string;
}

export default function RecipeCard({ id, name, thumbnail, category }: RecipeCardProps) {
  return (
    <Link
      href={`/recipe/${id}`}
      className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={thumbnail}
          alt={name}
          fill
          className="object-cover transition group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 line-clamp-1">{name}</h3>
        {category && (
          <span className="mt-1 inline-block rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-700">
            {category}
          </span>
        )}
      </div>
    </Link>
  );
}
