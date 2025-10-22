import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { weaponSkins } from "~/server/db/schema";
import { db } from "~/server/db";

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

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      filename,
      description,
      imageUrl,
      weaponType,
      weaponName,
      apiKey,
      price,
    } = body;

    if (!filename || !imageUrl || !weaponName || !weaponType || !apiKey) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newSkin = await db
      .insert(weaponSkins)
      .values({
        filename,
        description,
        imageUrl,
        userId,
        weaponType,
        weaponName,
        apiKey,
        price: Number(price) || 0, 
      })
      .returning();

    return NextResponse.json(newSkin[0]);
  } catch (error) {
    console.error("Error creating weapon skin:", error);
    return NextResponse.json(
      { error: "Failed to create weapon skin" },
      { status: 500 }
    );
  }
}
