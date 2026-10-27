import { S3Client } from "@aws-sdk/client-s3";

// Server-only: never import this file from a "use client" component —
// the secret access key must not reach the browser bundle.
export const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
  },
});

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME as string;
