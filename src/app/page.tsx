"use client";

import { SignedOut, SignInButton, SignedIn, useUser, UserButton } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HomePage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  // ✅ Redirect signed-in users to /dashboard/admin
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/admin");
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <div className="fixed inset-0 flex bg-[#0f1923] text-white overflow-hidden">
      {/* 🔻 TOP NAVIGATION BAR */}
      <nav className="absolute top-0 left-0 w-full flex items-center justify-between px-8 py-4 bg-[#1a2632]/90 backdrop-blur-md shadow-md z-30">
        <div className="flex items-center gap-3">
          <Image
            src="/valooo.png"
            alt="Valorant Logo"
            width={50}
            height={50}
            priority
          />
          <h1 className="text-xl font-extrabold tracking-widest text-[#ff4655] uppercase">
            ValoArmory
          </h1>
        </div>

        {/* Show user avatar if signed in */}
        <SignedIn>
          <div className="border border-[#ff4655] rounded-full p-1 hover:shadow-md transition">
            <UserButton />
          </div>
        </SignedIn>
      </nav>

      {/* 🔻 LEFT SIDE - Login Section (only visible when signed out) */}
      <SignedOut>
        <div className="relative flex flex-col justify-between items-center w-full md:w-[30%] px-6 py-8 z-10 bg-[#0f1923]/95 backdrop-blur-sm mt-16 md:mt-0">
          {/* MAIN LOGIN CONTENT */}
          <div className="flex flex-col justify-center items-center flex-grow">
            <div className="text-center space-y-3 mb-6 scale-90 md:scale-100">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-wider text-[#ff4655]">
                WELCOME BACK, AGENT
              </h1>
              <p className="text-xs md:text-sm text-gray-400">
                Log in to access your storage and continue your mission.
              </p>
            </div>

            {/* Sign In Section */}
            <div className="flex flex-col w-full max-w-xs space-y-4 scale-90 md:scale-100">
              <SignInButton mode="modal">
                <span className="w-full text-center bg-[#ff4655] hover:bg-[#e13c4a] py-3 rounded font-semibold tracking-wide cursor-pointer transition-colors">
                  Play Now
                </span>
              </SignInButton>
            </div>
          </div>

          {/* FOOTER LOGO SECTION */}
          <div className="h-24 flex flex-col items-center justify-center opacity-30 hover:opacity-100 transition-opacity">
            <div className="w-160 h-[1px] bg-[#cfcfcf] mb-3 rounded-full"></div>
            <Image
              src="/valooo.png"
              alt="Valorant Footer Logo"
              width={150}
              height={150}
              priority
              className="object-contain"
            />
          </div>
        </div>
      </SignedOut>

      {/* 🔻 RIGHT SIDE - Background Art (always visible) */}
      <div className="hidden md:flex w-[70%] relative">
        <Image
          src="/valo.jpg"
          alt="Valorant Artwork"
          fill
          className="object-cover opacity-90"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-l from-[#0f1923]/70 to-transparent" />
      </div>
    </div>
  );
}
