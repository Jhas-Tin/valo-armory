"use client";

import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "~/app/_components/Sidebar";

type WeaponSkin = {
  id: number;
  filename: string;
  weaponName: string;
  weaponType: string;
  apiKey: string;
  status: string;
  price?: number; // ✅ Added price support
  imageUrl?: string;
  description?: string | null;
  createdAt: string;
};

export default function AdminPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  const [apiKeys, setApiKeys] = useState<WeaponSkin[]>([]);
  const [skins, setSkins] = useState<WeaponSkin[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Redirect unauthenticated users
  useEffect(() => {
    if (isLoaded && !isSignedIn) router.replace("/");
  }, [isLoaded, isSignedIn, router]);

  // Fetch weapon skins
  const fetchApiKeys = async () => {
    try {
      const res = await fetch("/api/weapon-skins", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch weapon skins");
      const data = await res.json();
      setApiKeys(data);
      setSkins(data.filter((skin: WeaponSkin) => skin.status === "Active"));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  // Search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setSkins(
      apiKeys.filter(
        (skin) =>
          skin.status === "Active" &&
          skin.weaponName.toLowerCase().includes(value)
      )
    );
  };

  // Copy
  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    alert("API key copied!");
  };

  // Toggle Status (auto refresh)
  const toggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "Active" ? "Disabled" : "Active";
    try {
      await fetch("/api/weapon-skins/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      await fetchApiKeys();
    } catch (error) {
      console.error(error);
    }
  };

  const formatApiKey = (key: string) => {
    if (!key) return "N/A";
    return `${key.slice(0, 8)}...${key.slice(-4)}`;
  };

  return (
    <main className="min-h-screen bg-[#0f1923] text-white flex">
      <SignedOut>
        <div className="h-screen flex items-center justify-center w-full text-xl">
          Redirecting to Login...
        </div>
      </SignedOut>

      <SignedIn>
        <Sidebar />

        <section className="flex-1 ml-64 p-8 flex flex-col h-screen">
          <h1 className="text-3xl font-bold mb-6 text-white">
            Admin Dashboard
          </h1>

          {/* 🔹 Two-column grid that fills the screen */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
            {/* ✅ Left column (API + Rate Limit) */}
            <div className="flex flex-col h-full gap-6">
              <div className="bg-[#1a2632] p-6 rounded-xl shadow-lg flex-1 overflow-hidden flex flex-col">
                <h2 className="font-semibold text-lg text-[#ff4655] mb-4">
                  API Keys
                </h2>

                <div className="overflow-y-auto flex-1">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="text-gray-400 border-b border-gray-700">
                        <th className="py-2 px-3 text-left">Label</th>
                        <th className="py-2 px-3 text-left">API Key</th>
                        <th className="py-2 px-3 text-left">Created</th>
                        <th className="py-2 px-3 text-left">Status</th>
                        <th className="py-2 px-3 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="text-center py-10 text-gray-400"
                          >
                            Loading API keys...
                          </td>
                        </tr>
                      ) : apiKeys.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="text-center py-10 text-gray-500 italic"
                          >
                            No API keys found.
                          </td>
                        </tr>
                      ) : (
                        apiKeys.map((item) => (
                          <tr
                            key={item.id}
                            className="border-b border-gray-700 hover:bg-[#223142] transition"
                          >
                            <td className="py-3 px-3 font-medium text-gray-200">
                              {item.weaponName}
                            </td>

                            <td className="py-3 px-3 font-mono text-gray-300">
                              <span className="bg-[#0f1923] px-2 py-1 rounded-md">
                                {formatApiKey(item.apiKey)}
                              </span>
                              <button
                                onClick={() => handleCopy(item.apiKey)}
                                className="ml-2 text-sm text-blue-400 hover:underline"
                              >
                                Copy
                              </button>
                            </td>

                            <td className="py-3 px-3 text-gray-400">
                              {new Date(item.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "2-digit",
                                  year: "numeric",
                                }
                              )}
                            </td>

                            <td className="py-3 px-3">
                              <span
                                className={`${
                                  item.status === "Active"
                                    ? "bg-green-600/20 text-green-400"
                                    : "bg-gray-600/20 text-gray-400"
                                } text-xs font-medium px-2 py-1 rounded-full`}
                              >
                                {item.status}
                              </span>
                            </td>

                            <td className="py-3 px-3">
                              <button
                                onClick={() =>
                                  toggleStatus(item.id, item.status)
                                }
                                className={`${
                                  item.status === "Active"
                                    ? "bg-red-600 hover:bg-red-700"
                                    : "bg-green-600 hover:bg-green-700"
                                } text-white text-xs px-3 py-1.5 rounded-md`}
                              >
                                {item.status === "Active"
                                  ? "Disable"
                                  : "Enable"}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-[#1a2632] p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold text-[#ff4655] mb-4">
                  Rate Limit Plans
                </h3>
                <table className="w-full text-sm text-gray-300">
                  <thead className="text-gray-400 border-b border-gray-700">
                    <tr>
                      <th className="py-2 text-left">Plan</th>
                      <th className="py-2 text-left">Rate Limit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-gray-700">
                      <td className="py-2">Free</td>
                      <td className="py-2">60 req/min</td>
                    </tr>
                    <tr className="border-t border-gray-700">
                      <td className="py-2">Pro</td>
                      <td className="py-2">300 req/min</td>
                    </tr>
                    <tr className="border-t border-gray-700">
                      <td className="py-2">Enterprise</td>
                      <td className="py-2">1000 req/min</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 🛒 SHOP SECTION */}
            <div className="bg-[#1a2632] p-6 rounded-xl shadow-lg flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg text-[#ff4655]">Shop</h2>
                <input
                  type="text"
                  placeholder="Search skins..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="bg-[#0f1923] text-sm px-3 py-2 rounded-lg border border-gray-700 text-gray-300 placeholder-gray-500 w-1/2 focus:outline-none focus:ring-1 focus:ring-[#ff4655]"
                />
              </div>

              <div className="overflow-y-auto pr-2 flex-1">
                {loading ? (
                  <p className="text-gray-400 text-sm">Loading skins...</p>
                ) : skins.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500 italic text-sm">
                      No skins found.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 mt-4 auto-rows-[1fr]">
                    {skins.map((skin) => (
                      <div
                        key={skin.id}
                        className="bg-[#0f1923] border border-gray-700 rounded-lg p-3 shadow hover:shadow-[#ff465540] transition"
                      >
                        <img
                          src={skin.imageUrl || "/placeholder.jpg"}
                          alt={skin.weaponName}
                          className="w-full h-32 object-contain rounded-md mb-3"
                        />
                        <h3 className="font-semibold text-md">
                          {skin.weaponName}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {skin.description || "No description available."}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-[#4fc3f7] font-semibold">
                            {skin.price
                              ? `${skin.price.toLocaleString()} VP`
                              : "0 VP"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </SignedIn>
    </main>
  );
}
