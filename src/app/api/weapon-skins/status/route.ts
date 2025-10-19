import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { weaponSkins } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }

    await db
      .update(weaponSkins)
      .set({ status })
      .where(eq(weaponSkins.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating status:", error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
