"use client";

import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "~/app/_components/Sidebar";

export default function WeaponsPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  const [weapons, setWeapons] = useState<
    { id: number; name: string; type: string }[]
  >([]);

  // ✅ Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) router.replace("/");
  }, [isLoaded, isSignedIn, router]);

  // ✅ Fetch weapons from DB
  useEffect(() => {
    async function fetchWeapons() {
      const res = await fetch("/api/weapons");
      const data = await res.json();
      setWeapons(data);
    }
    fetchWeapons();
  }, []);

  // ➕ Add weapon
  async function handleAddWeapon() {
    const name = prompt("Enter weapon name:");
    const type = prompt("Enter weapon type:");
    if (!name || !type) return;

    const res = await fetch("/api/weapons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, type }),
    });

    const newWeapon = await res.json();
    setWeapons((prev) => [...prev, newWeapon]);
  }

  // 🗑️ Delete weapon
  async function handleDelete(id: number) {
    await fetch("/api/weapons", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setWeapons((prev) => prev.filter((w) => w.id !== id));
  }

  return (
    <main className="min-h-screen bg-[#0f1923] text-white flex">
      <SignedOut>
        <div className="h-screen flex items-center justify-center w-full text-xl">
          Redirecting to Login...
        </div>
      </SignedOut>

      <SignedIn>
        <Sidebar />

        <section className="flex-1 ml-64 p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Admin Weapons</h1>
            <button
              onClick={handleAddWeapon}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold"
            >
              + Add weapon
            </button>
          </div>

          <div className="bg-[#1a2632] rounded-xl shadow-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#111a24] text-gray-300">
                <tr>
                  <th className="py-3 px-6">Name</th>
                  <th className="py-3 px-6">Type</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {weapons.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-8 text-center text-gray-500 italic"
                    >
                      No weapons added yet. Click “+ Add weapon” to begin.
                    </td>
                  </tr>
                ) : (
                  weapons.map((weapon) => (
                    <tr
                      key={weapon.id}
                      className="border-t border-gray-700 hover:bg-[#222f3d]"
                    >
                      <td className="py-3 px-6 font-medium">{weapon.name}</td>
                      <td className="py-3 px-6 text-gray-300">{weapon.type}</td>
                      <td className="py-3 px-6 text-right">
                        <button
                          onClick={() => handleDelete(weapon.id)}
                          className="text-red-400 hover:text-red-500 mr-3"
                        >
                          Delete
                        </button>
                        <button className="text-blue-400 hover:text-blue-500">
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </SignedIn>
    </main>
  );
}
