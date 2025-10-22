import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { weaponSkins } from "~/server/db/schema";

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function GET() {
  try {
    const skins = await db.select().from(weaponSkins);

    const safeSkins = skins
      .filter((s) => s.weaponName && s.weaponType)
      .map((s) => ({
        id: s.id,
        weaponName: s.weaponName ?? "Unknown",
        weaponType: s.weaponType ?? "Unknown",
        imageUrl: s.imageUrl ?? "",
        description: s.description ?? "",
        price: Number(s.price ?? 0),
        status: s.status ?? "Inactive",
      }));

    return new Response(JSON.stringify(safeSkins), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", 
      },
    });
  } catch (error) {
    console.error("Error fetching public skins:", error);

    return NextResponse.json(
      { error: "Failed to fetch weapon skins" },
      { status: 500 }
    );
  }
}
