"use client";

import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "~/app/_components/Sidebar";

export default function PurchasesPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  const [purchases, setPurchases] = useState<
    {
      id: number;
      weaponId: number;
      weaponName: string;
      imageUrl: string;
      price: number;
      userId: string;
      createdAt: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/");
    }
  }, [isLoaded, isSignedIn, router]);

  // ✅ Fetch all purchases (from same ValoArmory backend)
  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/purchases", {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch purchases");
      const data = await res.json();
      setPurchases(data);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  return (
    <main className="min-h-screen bg-[#0f1923] text-white flex">
      <SignedOut>
        <div className="h-screen flex items-center justify-center w-full text-xl">
          Redirecting to Login...
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex w-full h-screen">
          {/* 🧭 Sidebar */}
          <div className="w-1/5 min-w-[200px] max-w-[300px] bg-[#0f1923]">
            <Sidebar />
          </div>

          {/* 📦 Purchases Table */}
          <div className="w-4/5 flex-1 overflow-auto bg-[#0f1923] p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">User Purchases</h1>
            </div>

            <div className="bg-[#1a2734] rounded-xl shadow-lg overflow-x-auto">
              <table className="min-w-full text-left text-gray-200 border-collapse">
                <thead className="bg-[#18222e] text-gray-400 uppercase text-sm">
                  <tr>
                    <th className="px-6 py-3">Weapon Image</th>
                    <th className="px-6 py-3">Weapon Name</th>
                    <th className="px-6 py-3">User ID</th>
                    <th className="px-6 py-3">Price</th>
                    <th className="px-6 py-3">Purchased At</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-10 text-lg text-gray-400"
                      >
                        Loading purchases...
                      </td>
                    </tr>
                  ) : purchases.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-10 text-lg text-gray-500 italic"
                      >
                        No purchases found.
                      </td>
                    </tr>
                  ) : (
                    purchases.map((p) => (
                      <tr
                        key={p.id}
                        className="border-t border-gray-700 hover:bg-[#223142] transition"
                      >
                        <td className="px-6 py-3">
                          <img
                            src={p.imageUrl || "/placeholder.jpg"}
                            alt={p.weaponName}
                            className="w-16 h-16 object-contain rounded-md"
                          />
                        </td>
                        <td className="px-6 py-3 font-semibold text-white">
                          {p.weaponName}
                        </td>
                        <td className="px-6 py-3 text-gray-400">{p.userId}</td>
                        <td className="px-6 py-3 text-green-400 font-semibold">
                          {p.price?.toLocaleString() || "0"} VP
                        </td>
                        <td className="px-6 py-3 text-gray-400">
                          {new Date(p.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </SignedIn>
    </main>
  );
}
