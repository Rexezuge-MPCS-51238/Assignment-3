"use client";

import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for recipes..."
        className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="rounded-lg bg-orange-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
      >
        {isLoading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}
