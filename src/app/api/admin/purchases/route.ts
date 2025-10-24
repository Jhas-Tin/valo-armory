import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { purchased } from "~/server/db/schema";

export async function GET() {
  try {
    const data = await db.select().from(purchased).orderBy(purchased.createdAt);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching purchases:", error);
    return NextResponse.json(
      { error: "Failed to fetch purchases" },
      { status: 500 }
    );
  }
}
