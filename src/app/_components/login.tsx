import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";

export function LoginPage() {
  return (
    <div className="fixed inset-0 flex bg-[#0f1923] text-white overflow-hidden">

      {/* VALORANT LOGO - Top Left */}
      <div className="absolute top-4 left-4 flex items-center gap-3 z-20">
        <Image
          src="/valooo.png"
          alt="Valorant Logo"
          width={150}
          height={150}
          priority
          className="object-contain"
        />
      </div>

      {/* LEFT SIDE - Login Section (30%) */}
      <div className="relative flex flex-col justify-between items-center w-full md:w-[30%] px-6 py-8 z-10 bg-[#0f1923]/95 backdrop-blur-sm">

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
            <SignedOut>
              <SignInButton mode="redirect">
                <span className="w-full text-center bg-[#ff4655] hover:bg-[#e13c4a] py-3 rounded font-semibold tracking-wide cursor-pointer transition-colors">
                  Sign In
                </span>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="cursor-pointer border border-[#ff4655] rounded-full flex items-center justify-center w-12 h-12 md:w-14 md:h-14 hover:shadow-lg transition-shadow bg-gray-800">
                  <UserButton />
                </div>
                <p className="text-gray-400 text-xs md:text-sm">
                  You’re already signed in.
                </p>
              </div>
            </SignedIn>
          </div>
        </div>

        {/* FOOTER LOGO SECTION WITH HEIGHT */}
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

      {/* RIGHT SIDE - Background Art (70%) */}
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
