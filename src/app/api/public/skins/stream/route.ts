import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { weaponSkins } from "~/server/db/schema";

export async function GET() {
  return new Response(
    new ReadableStream({
      async start(controller) {
        const send = async () => {
          const skins = await db.select().from(weaponSkins);
          const active = skins.filter(
            (s: any) => s.status === "Active" && s.imageUrl?.trim() !== ""
          );
          controller.enqueue(`data: ${JSON.stringify(active)}\n\n`);
        };
        
        await send();

        const interval = setInterval(send, 5000);

        return () => clearInterval(interval);
      },
    }),
    {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}
