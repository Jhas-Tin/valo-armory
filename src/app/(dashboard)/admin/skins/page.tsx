"use client";

import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "~/app/_components/Sidebar";
import { UploadDialog } from "~/app/_components/upload-dialog";

export default function WeaponsPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  const [skins, setSkins] = useState<
    {
      id: number;
      filename: string;
      weaponType: string;
      weaponName: string;
      imageUrl: string;
      description: string | null;
      price?: number;
      apiKey?: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Redirect unauthenticated users
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/");
    }
  }, [isLoaded, isSignedIn, router]);

  // Fetch uploaded weapon skins
  const fetchSkins = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/weapon-skins", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch skins");
      const data = await res.json();
      setSkins(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkins();
  }, []);

  const handleUploadComplete = () => {
    fetchSkins();
  };

  // Helper to mask API key
  const maskApiKey = (key?: string) => {
    if (!key) return "N/A";
    const visiblePart = key.slice(-4);
    return `sk_live_${"_".repeat(3)}${visiblePart}`;
  };

  return (
    <main className="min-h-screen bg-[#0f1923] text-white flex">
      <SignedOut>
        <div className="h-screen flex items-center justify-center w-full text-xl">
          Redirecting to Login...
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex w-full h-screen">
          {/* Sidebar */}
          <div className="w-1/5 min-w-[200px] max-w-[300px] bg-[#0f1923]">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="w-4/5 flex-1 overflow-auto bg-[#0f1923] p-8">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Admin Weapon Skins</h1>
              <UploadDialog onUploadComplete={handleUploadComplete} />
            </div>

            {/* Table Section */}
            <div className="bg-[#1a2734] rounded-xl shadow-lg overflow-x-auto">
              <table className="min-w-full text-left text-gray-200 border-collapse">
                <thead className="bg-[#18222e] text-gray-400 uppercase text-sm">
                  <tr>
                    <th className="px-6 py-3">Image</th>
                    <th className="px-6 py-3">Filename</th>
                    <th className="px-6 py-3">Weapon Name</th>
                    <th className="px-6 py-3">Weapon Type</th>
                    <th className="px-6 py-3">Description</th>
                    <th className="px-6 py-3">Price ($)</th>
                    <th className="px-6 py-3">API Key</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-10 text-lg text-gray-400"
                      >
                        Loading skins...
                      </td>
                    </tr>
                  ) : skins.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-10 text-lg text-gray-500 italic"
                      >
                        No uploaded weapon skins found.
                      </td>
                    </tr>
                  ) : (
                    skins.map((skin) => (
                      <tr
                        key={skin.id}
                        className="border-t border-gray-700 hover:bg-[#223142] transition"
                      >
                        <td className="px-6 py-3">
                          <img
                            src={skin.imageUrl}
                            alt={skin.filename}
                            className="w-16 h-16 object-contain rounded-md"
                          />
                        </td>
                        <td className="px-6 py-3 font-semibold text-white">
                          {skin.filename}
                        </td>
                        <td className="px-6 py-3 text-gray-300">
                          {skin.weaponName}
                        </td>
                        <td className="px-6 py-3 text-gray-300">
                          {skin.weaponType}
                        </td>
                        <td className="px-6 py-3 text-gray-400">
                          {skin.description || "No description"}
                        </td>
                        <td className="px-6 py-3 text-green-400 font-semibold">
                          {skin.price?.toLocaleString() || "0"} VP
                        </td>
                        <td className="px-6 py-3 text-gray-400 font-mono">
                          {maskApiKey(skin.apiKey)}
                        </td>
                        <td className="px-6 py-3 text-right">
                          <button className="text-blue-400 hover:underline">
                            Manage
                          </button>
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
