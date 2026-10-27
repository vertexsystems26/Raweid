import { NextResponse } from "next/server";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2, R2_BUCKET_NAME } from "@/lib/r2";

const ALLOWED_FOLDERS = new Set(["services", "products", "courses"]);

function hasR2Config() {
  return Boolean(
    process.env.R2_ENDPOINT &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET_NAME &&
      process.env.NEXT_PUBLIC_R2_PUBLIC_URL
  );
}

function publicUrlFor(key: string): string {
  const base = (process.env.NEXT_PUBLIC_R2_PUBLIC_URL as string).replace(/\/$/, "");
  return `${base}/${key}`;
}

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
  if (!hasR2Config()) {
    console.error("[R2 Error] Missing R2_ENDPOINT/R2_ACCESS_KEY_ID/R2_SECRET_ACCESS_KEY/R2_BUCKET_NAME/NEXT_PUBLIC_R2_PUBLIC_URL env vars.");
    return NextResponse.json(
      { error: "Configuration R2 manquante côté serveur (variables d'environnement)." },
      { status: 500 }
    );
  }

  const extension = file.name.includes(".") ? file.name.split(".").pop() : undefined;
  const key = `raweid/${folder}/${crypto.randomUUID()}${extension ? `.${extension}` : ""}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    await r2.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type || "application/octet-stream",
      })
    );
    return NextResponse.json({ url: publicUrlFor(key) });
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.error("[R2 Error] upload:", reason, err);
    const message =
      process.env.NODE_ENV === "production"
        ? "Échec du téléversement vers le stockage."
        : `Échec du téléversement vers le stockage : ${reason}`;
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export async function DELETE(request: Request) {
  if (!hasR2Config()) {
    return NextResponse.json(
      { error: "Configuration R2 manquante côté serveur (variables d'environnement)." },
      { status: 500 }
    );
  }

  const { url } = (await request.json().catch(() => ({}))) as { url?: unknown };
  if (typeof url !== "string" || !url) {
    return NextResponse.json({ error: "URL manquante." }, { status: 400 });
  }

  const base = (process.env.NEXT_PUBLIC_R2_PUBLIC_URL as string).replace(/\/$/, "");
  if (!url.startsWith(`${base}/`)) {
    return NextResponse.json({ error: "URL invalide." }, { status: 400 });
  }
  const key = url.slice(base.length + 1);

  try {
    await r2.send(new DeleteObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[R2 Error] delete:", err);
    return NextResponse.json({ error: "Échec de la suppression de l'image." }, { status: 502 });
  }
}
