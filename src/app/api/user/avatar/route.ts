import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const form = await request.formData();
    const file = form.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const mime = file.type || "image/jpeg";
    const ext = mime.includes("png") ? "png" : mime.includes("webp") ? "webp" : mime.includes("gif") ? "gif" : "jpg";

    const uploadsDir = path.join(process.cwd(), "public", "uploads", "avatars");
    await fs.promises.mkdir(uploadsDir, { recursive: true });

    const filename = `${session.user.id}-${Date.now()}.${ext}`;
    const filepath = path.join(uploadsDir, filename);
    await fs.promises.writeFile(filepath, buffer);

    const url = `/uploads/avatars/${filename}`;
    return NextResponse.json({ success: true, url }, { status: 201 });
  } catch (error) {
    console.error("Erreur upload avatar:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

