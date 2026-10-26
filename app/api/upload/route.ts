import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";

const ALLOWED_FOLDERS = new Set(["services", "products"]);

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const folder = formData.get("folder");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fichier manquant." }, { status: 400 });
  }
  if (typeof folder !== "string" || !ALLOWED_FOLDERS.has(folder)) {
    return NextResponse.json({ error: "Dossier de destination invalide." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: `raweid/${folder}`,
      resource_type: "image",
    });
    return NextResponse.json({ url: result.secure_url });
  } catch (err) {
    console.error("[Cloudinary Error] upload:", err);
    return NextResponse.json({ error: "Échec du téléversement vers Cloudinary." }, { status: 502 });
  }
}
