"use client";

import { Home, Sword, ShoppingBag, Receipt } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { cn } from "~/lib/utils";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", icon: Home, href: "/admin" },
  { label: "Weapons", icon: Sword, href: "/admin/weapons" },
  { label: "Skins", icon: ShoppingBag, href: "/admin/skins" },
  { label: "Purchases", icon: Receipt, href: "/admin/purchases" }, // ✅ new
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-[17rem] bg-[#111b26] border-r border-gray-800 flex flex-col justify-between fixed left-0 top-0">
      <div>
        {/* 🔺 Logo */}
        <div className="flex items-center gap-3 p-6 border-b border-gray-800">
          <Image
            src="/valooo.png"
            alt="ValoArmory"
            width={45}
            height={45}
            className="object-contain rounded-full border border-[#ff4655]"
          />
          <h1 className="text-lg font-bold text-[#ff4655] tracking-widest uppercase">
            ValoArmory
          </h1>
        </div>

        {/* 🔹 Navigation */}
        <nav className="mt-6 flex flex-col space-y-1">
          {navItems.map(({ label, icon: Icon, href }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={label}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-5 py-2 rounded-md mx-2 text-sm transition",
                  isActive
                    ? "bg-[#1f2a38] text-white"
                    : "text-gray-300 hover:bg-[#1a2632] hover:text-white"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5",
                    isActive ? "text-[#ff4655]" : "text-gray-400"
                  )}
                />
                <span className="font-medium">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 🔻 User Button */}
      <div className="p-5 border-t border-gray-800 flex items-center justify-between">
        <p className="text-gray-400 text-xs font-medium">Signed in as</p>

        <div className="relative w-10 h-10 rounded-full border-2 border-[#ff4655] flex items-center justify-center overflow-hidden shadow-[0_0_10px_#ff465580]">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-10 h-10 rounded-full",
              },
            }}
          />
        </div>
      </div>
    </aside>
  );
}
