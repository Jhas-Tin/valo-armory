"use client";

import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "~/app/_components/Sidebar";
import { UploadDialog } from "~/app/_components/upload-dialog";
import { Dialog } from "@headlessui/react";
import { Toaster, toast } from "sonner"; // ✅ Sonner for notifications

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
  const [selectedSkin, setSelectedSkin] = useState<
    | null
    | {
        id: number;
        filename: string;
        weaponType: string;
        weaponName: string;
        imageUrl: string;
        description: string | null;
        price?: number;
        apiKey?: string;
      }
  >(null);

  const [editData, setEditData] = useState({
    filename: "",
    weaponType: "",
    weaponName: "",
    description: "",
    price: 0,
    apiKey: "",
  });

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/");
    }
  }, [isLoaded, isSignedIn, router]);

  const fetchSkins = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/weapon-skins", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch skins");
      const data = await res.json();
      setSkins(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load weapon skins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkins();
  }, []);

  const handleUploadComplete = () => {
    fetchSkins();
    toast.success("Weapon skin uploaded successfully!");
  };

  const handleEditClick = (skin: any) => {
    setSelectedSkin(skin);
    setEditData({
      filename: skin.filename,
      weaponType: skin.weaponType,
      weaponName: skin.weaponName,
      description: skin.description || "",
      price: skin.price || 0,
      apiKey: skin.apiKey || "",
    });
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async () => {
    if (!selectedSkin) return;

    toast.info("Updating weapon skin...");

    try {
      const res = await fetch(`/api/weapon-skins/${selectedSkin.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      if (!res.ok) throw new Error("Failed to update weapon skin");

      await fetchSkins();
      setSelectedSkin(null);
      toast.success("Weapon skin updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update weapon skin");
    }
  };

  const maskApiKey = (key?: string) => {
    if (!key) return "N/A";
    const visiblePart = key.slice(-4);
    return `sk_live_${"_".repeat(3)}${visiblePart}`;
  };

  return (
    <main className="min-h-screen bg-[#0f1923] text-white flex">
      <Toaster richColors position="top-right" /> {/* ✅ Sonner mounted here */}

      <SignedOut>
        <div className="h-screen flex items-center justify-center w-full text-xl">
          Redirecting to Login...
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex w-full h-screen">
          <div className="w-1/5 min-w-[200px] max-w-[300px] bg-[#0f1923]">
            <Sidebar />
          </div>

          <div className="w-4/5 flex-1 overflow-auto bg-[#0f1923] p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Admin Weapon Skins</h1>
              <UploadDialog onUploadComplete={handleUploadComplete} />
            </div>

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
                          <button
                            className="text-blue-400 hover:underline"
                            onClick={() => handleEditClick(skin)}
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* --- Edit Modal --- */}
            {selectedSkin && (
              <Dialog
                open={true}
                onClose={() => setSelectedSkin(null)}
                className="fixed inset-0 z-50 flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
                <div className="relative bg-[#1a2734] text-white rounded-xl p-6 w-full max-w-md shadow-lg">
                  <Dialog.Title className="text-xl font-semibold mb-4">
                    Edit Weapon Skin
                  </Dialog.Title>

                  <div className="space-y-3">
                    {[ 
                      "filename", 
                      "weaponName", 
                      "weaponType", 
                      "description", 
                      "price", 
                      "apiKey" 
                    ].map((field) =>
                      field === "description" ? (
                        <textarea
                          key={field}
                          name={field}
                          value={editData[field as keyof typeof editData]}
                          onChange={handleEditChange}
                          placeholder="Description"
                          rows={3}
                          className="w-full p-2 bg-[#0f1923] rounded border border-gray-600"
                        />
                      ) : (
                        <input
                          key={field}
                          name={field}
                          type={field === "price" ? "number" : "text"}
                          value={editData[field as keyof typeof editData]}
                          onChange={handleEditChange}
                          placeholder={field.replace(/^\w/, (c) => c.toUpperCase())}
                          className="w-full p-2 bg-[#0f1923] rounded border border-gray-600"
                        />
                      )
                    )}
                  </div>

                  <div className="mt-5 flex justify-end space-x-3">
                    <button
                      onClick={() => setSelectedSkin(null)}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleEditSave}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </Dialog>
            )}
          </div>
        </div>
      </SignedIn>
    </main>
  );
}
