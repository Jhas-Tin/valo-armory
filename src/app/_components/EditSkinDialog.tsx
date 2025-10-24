"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";

interface EditSkinDialogProps {
  skin: {
    id: number;
    filename: string;
    weaponType: string;
    weaponName: string;
    imageUrl: string;
    description: string | null;
    price?: number;
    apiKey?: string;
  };
  onClose: () => void;
  onSave: () => void;
}

export function EditSkinDialog({ skin, onClose, onSave }: EditSkinDialogProps) {
  const [formData, setFormData] = useState({
    filename: skin.filename,
    weaponType: skin.weaponType,
    weaponName: skin.weaponName,
    description: skin.description || "",
    price: skin.price || 0,
    apiKey: skin.apiKey || "",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/weapon-skins/${skin.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update weapon skin");

      onSave(); // refresh parent table
      onClose();
    } catch (error) {
      console.error(error);
      alert("Error updating skin");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
      <div className="relative bg-[#1a2734] text-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <Dialog.Title className="text-xl font-semibold mb-4">Edit Weapon Skin</Dialog.Title>

        <div className="space-y-3">
          <input
            name="filename"
            value={formData.filename}
            onChange={handleChange}
            placeholder="Filename"
            className="w-full p-2 bg-[#0f1923] rounded border border-gray-600"
          />
          <input
            name="weaponName"
            value={formData.weaponName}
            onChange={handleChange}
            placeholder="Weapon Name"
            className="w-full p-2 bg-[#0f1923] rounded border border-gray-600"
          />
          <input
            name="weaponType"
            value={formData.weaponType}
            onChange={handleChange}
            placeholder="Weapon Type"
            className="w-full p-2 bg-[#0f1923] rounded border border-gray-600"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            rows={3}
            className="w-full p-2 bg-[#0f1923] rounded border border-gray-600"
          />
          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full p-2 bg-[#0f1923] rounded border border-gray-600"
          />
          <input
            name="apiKey"
            value={formData.apiKey}
            onChange={handleChange}
            placeholder="API Key"
            className="w-full p-2 bg-[#0f1923] rounded border border-gray-600"
          />
        </div>

        <div className="mt-5 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
