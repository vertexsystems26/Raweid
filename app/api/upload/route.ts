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
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error("[Cloudinary Error] Missing CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET env vars.");
    return NextResponse.json(
      { error: "Configuration Cloudinary manquante côté serveur (variables d'environnement)." },
      { status: 500 }
    );
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
    const reason = err instanceof Error ? err.message : String((err as { message?: unknown })?.message ?? err);
    console.error("[Cloudinary Error] upload:", reason, err);
    const message =
      process.env.NODE_ENV === "production"
        ? "Échec du téléversement vers Cloudinary."
        : `Échec du téléversement vers Cloudinary : ${reason}`;
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
