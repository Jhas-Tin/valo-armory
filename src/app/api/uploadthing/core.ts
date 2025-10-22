import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { db } from "~/server/db";
import { weaponSkins } from "~/server/db/schema";
import { z } from "zod";
import crypto from "crypto"; 

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .input(
      z.object({
        description: z.string().optional(),
        weaponType: z.string(),
        weaponName: z.string(),
        price: z.number().min(0), 
      })
    )

    .middleware(async ({ req, input }) => {
      const user = await auth();
      if (!user.userId) throw new UploadThingError("Unauthorized");

      return {
        userId: user.userId,
        description: input.description,
        weaponType: input.weaponType,
        weaponName: input.weaponName,
        price: input.price, 
      };
    })

    .onUploadComplete(async ({ metadata, file }) => {
      console.log("✅ Upload complete for userId:", metadata.userId);
      console.log("🖼️ File URL:", file.ufsUrl);

      const apiKey = crypto
        .createHash("sha256")
        .update(`${metadata.userId}-${file.name}-${Date.now()}`)
        .digest("hex");

      await db.insert(weaponSkins).values({
        filename: file.name,
        imageUrl: file.ufsUrl,
        userId: metadata.userId,
        weaponType: metadata.weaponType,
        weaponName: metadata.weaponName,
        description: metadata.description ?? null,
        price: metadata.price, 
        apiKey,
      });

      return {
        uploadedBy: metadata.userId,
        apiKey,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
