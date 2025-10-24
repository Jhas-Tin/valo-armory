import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { purchased } from "~/server/db/schema";

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
    const body = await req.json();
    const { weaponId, weaponName, imageUrl, price, userId } = body;

    // ✅ Validation
    if (!weaponId || !weaponName || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400, headers: corsHeaders }
      );
    }

    // ✅ Insert purchase record
    await db.insert(purchased).values({
      weaponId,
      weaponName,
      imageUrl,
      price: price || 0,
      userId,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { success: true, message: "Purchase saved successfully!" },
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
