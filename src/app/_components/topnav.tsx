"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export function TopNav() {
  return (
    <nav className="w-full bg-gray-900 text-white border-b shadow-md">
      <div className="flex items-center justify-between w-full px-4 sm:px-6 lg:px-8 py-3">
        
        <span className="font-bold text-lg sm:text-xl md:text-2xl tracking-wide truncate">
          Integrative Programming
        </span>

        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <SignedOut>
            <SignInButton>
              <span className="px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer font-semibold text-xs sm:text-sm md:text-base">
                Sign In
              </span>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <div className="cursor-pointer border border-blue-300 rounded-full flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 hover:shadow-lg transition-shadow bg-gray-800">
              <UserButton />
            </div>
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
