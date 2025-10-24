import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { weaponSkins } from "~/server/db/schema";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { filename, description, imageUrl, weaponType, weaponName, apiKey, price } = body;

    const updated = await db
      .update(weaponSkins)
      .set({
        filename,
        description,
        imageUrl,
        weaponType,
        weaponName,
        apiKey,
        price: Number(price),
      })
      .where(eq(weaponSkins.id, Number(params.id)))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Error updating weapon skin:", error);
    return NextResponse.json({ error: "Failed to update weapon skin" }, { status: 500 });
  }
}
