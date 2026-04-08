"use client";

import Link from "next/link";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

export default function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-orange-600">
          Recipe Finder
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-gray-700 hover:text-orange-600">
            Home
          </Link>
          <Link href="/recipes" className="text-sm font-medium text-gray-700 hover:text-orange-600">
            Browse
          </Link>
          {isSignedIn && (
            <Link href="/favorites" className="text-sm font-medium text-gray-700 hover:text-orange-600">
              Favorites
            </Link>
          )}
          {isSignedIn ? (
            <UserButton />
          ) : (
            <SignInButton mode="modal">
              <button className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700">
                Sign In
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </nav>
  );
}
