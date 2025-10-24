import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { purchased } from "~/server/db/schema";
import { eq } from "drizzle-orm";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// ✅ Handle CORS preflight
export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

// ✅ GET /api/public/purchases?userId=xxxx
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400, headers: corsHeaders }
      );
    }

    const purchases = await db
      .select()
      .from(purchased)
      .where(eq(purchased.userId, userId))
      .orderBy(purchased.createdAt);

    return NextResponse.json(purchases, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching user purchases:", error);
    return NextResponse.json(
      { error: "Failed to fetch purchases" },
      { status: 500, headers: corsHeaders }
    );
  }
}
