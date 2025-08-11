export function getBaseUrl() {
  const publicUrl =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
  if (publicUrl) return publicUrl.replace(/\/+$/, "");

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`;

  return "http://localhost:3000";
}