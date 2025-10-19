import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { weaponSkins } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const skins = await db
      .select()
      .from(weaponSkins)
      .where(eq(weaponSkins.userId, userId));

    return NextResponse.json(skins);
  } catch (error) {
    console.error("Error fetching weapon skins:", error);
    return NextResponse.json(
      { error: "Failed to fetch weapon skins" },
      { status: 500 }
    );
  }
}
