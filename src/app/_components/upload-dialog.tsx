"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { UploadButton } from "~/utils/uploadthing";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "~/components/ui/dialog";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

async function fetchWeapons(): Promise<{ name: string; type: string }[]> {
  const res = await fetch("/api/weapons");
  if (!res.ok) return [];
  const data = await res.json();
  return data.map((w: { name: string; type: string }) => ({
    name: w.name,
    type: w.type,
  }));
}

type UploadDialogProps = {
  onUploadComplete?: () => void;
};

export function UploadDialog({ onUploadComplete }: UploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [weaponType, setWeaponType] = useState("");
  const [weaponName, setWeaponName] = useState("");
  const [price, setPrice] = useState(""); // ✅ use string so user can freely type
  const [weaponTypes, setWeaponTypes] = useState<string[]>([]);
  const [weaponNames, setWeaponNames] = useState<string[]>([]);

  useEffect(() => {
    fetchWeapons().then((weapons) => {
      setWeaponTypes(Array.from(new Set(weapons.map((w) => w.type))));
      setWeaponNames(Array.from(new Set(weapons.map((w) => w.name))));
    });
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#ff4655] hover:bg-[#e13d4a] text-white font-semibold">
          + Add Weapon Skin
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[#1a2632] border border-[#2b3a4a] text-white rounded-lg max-w-md p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-[#ff4655] text-lg font-bold">
            Upload New Skin
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Add a new weapon skin to your ValoArmory collection.
          </DialogDescription>
        </DialogHeader>

        <Card className="w-full bg-[#1a2632] text-white border border-[#2b3a4a] shadow-md">
          <CardContent className="space-y-4 mt-4">
            {/* Description Input */}
            <div>
              <label
                htmlFor="skin-description"
                className="text-sm text-gray-300 block mb-1"
              >
                Skin Description
              </label>
              <Input
                id="skin-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter skin description..."
                className="bg-[#0f1923] text-white border-gray-700 focus-visible:ring-[#ff4655]"
              />
            </div>

            {/* Price Input */}
            <div>
              <label
                htmlFor="price-input"
                className="text-sm text-gray-300 block mb-1"
              >
                Price ($)
              </label>
              <Input
                id="price-input"
                type="text" // ✅ allow full typing freedom
                value={price}
                onChange={(e) => setPrice(e.target.value)} // ✅ keep as string
                placeholder="Enter skin price..."
                className="bg-[#0f1923] text-white border-gray-700 focus-visible:ring-[#ff4655]"
              />
            </div>

            {/* Weapon Name Dropdown */}
            <div>
              <label
                htmlFor="weapon-name-select"
                className="text-sm text-gray-300 block mb-1"
              >
                Weapon Name
              </label>
              <select
                id="weapon-name-select"
                value={weaponName}
                onChange={(e) => setWeaponName(e.target.value)}
                className="bg-[#0f1923] text-white border border-gray-700 rounded-lg px-3 py-2 w-full focus-visible:ring-[#ff4655]"
              >
                <option value="" disabled>
                  Select weapon name...
                </option>
                {weaponNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Weapon Type Dropdown */}
            <div>
              <label
                htmlFor="weapon-type-select"
                className="text-sm text-gray-300 block mb-1"
              >
                Weapon Type
              </label>
              <select
                id="weapon-type-select"
                value={weaponType}
                onChange={(e) => setWeaponType(e.target.value)}
                className="bg-[#0f1923] text-white border border-gray-700 rounded-lg px-3 py-2 w-full focus-visible:ring-[#ff4655]"
              >
                <option value="" disabled>
                  Select weapon type...
                </option>
                {weaponTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Upload Button */}
            <div className="mt-4">
              <UploadButton
                endpoint="imageUploader"
                input={{
                  description,
                  weaponType,
                  weaponName,
                  price: Number(price) || 0, // ✅ convert only on upload
                }}
                appearance={{
                  button:
                    "bg-[#ff4655] hover:bg-[#e03e4c] text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 shadow-md w-full",
                  allowedContent: "text-gray-400 text-sm mt-1",
                }}
                content={{
                  button: "Upload Skin Image",
                }}
                onClientUploadComplete={(res) => {
                  console.log("Files: ", res);
                  toast.success("Upload completed successfully!");
                  setDescription("");
                  setWeaponType("");
                  setWeaponName("");
                  setPrice("");
                  setOpen(false);
                  onUploadComplete?.();
                }}
                onUploadError={(error: Error) => {
                  console.error("Upload error:", error);
                  toast.error(`ERROR! ${error.message}`);
                }}
                disabled={!weaponType || !weaponName || !price}
              />
            </div>
          </CardContent>

          <CardFooter className="text-gray-500 text-xs justify-center py-2">
            Once uploaded, the skin will appear in your collection.
          </CardFooter>
        </Card>

        <DialogFooter className="flex justify-end">
          <Button
            variant="outline"
            className="text-gray-300 border-gray-600 hover:bg-[#222f3d]"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
