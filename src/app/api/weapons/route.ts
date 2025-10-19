import { db } from "~/server/db";
import { weapons } from "~/server/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

// ✅ GET — fetch all weapons
export async function GET() {
  const data = await db.select().from(weapons).orderBy(weapons.id);
  return NextResponse.json(data);
}

// ✅ POST — add a new weapon
export async function POST(req: Request) {
  const body = await req.json();
  const { name, type } = body;

  if (!name || !type) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const [inserted] = await db
    .insert(weapons)
    .values({ name, type })
    .returning();

  return NextResponse.json(inserted);
}

// ✅ DELETE — delete weapon by id
export async function DELETE(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  await db.delete(weapons).where(eq(weapons.id, id));
  return NextResponse.json({ success: true });
}
