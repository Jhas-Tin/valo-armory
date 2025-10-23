import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { purchased } from "~/server/db/schema";
import { currentUser } from "@clerk/nextjs/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers: corsHeaders }
      );
    }

    const body = await req.json();
    const { weaponId, weaponName, imageUrl, price } = body;

    if (!weaponId || !weaponName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400, headers: corsHeaders }
      );
    }

    await db.insert(purchased).values({
      weaponId,
      weaponName,
      imageUrl,
      price: price || 0,
      userId: user.id,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { success: true },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error saving purchase:", error);
    return NextResponse.json(
      { error: "Failed to save purchase" },
      { status: 500, headers: corsHeaders }
    );
  }
}
