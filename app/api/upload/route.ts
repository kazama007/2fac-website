import { NextRequest, NextResponse } from "next/server";

// Server-side image upload to GitHub repo.
// Token stays on the server — never shipped to the browser.
const GITHUB_REPO = "kazama007/2fac-images";
const GITHUB_BRANCH = "main";

export async function POST(req: NextRequest) {
  try {
    // Only the admin can upload — password verified server-side
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "2fac@admin123";
    if (req.headers.get("x-admin-password") !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Prefer server-only GITHUB_TOKEN; falls back to old var so nothing breaks
    // until the Vercel env var is renamed.
    const token = process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN;
    if (!token) {
      return NextResponse.json({ error: "Upload not configured" }, { status: 500 });
    }

    const { fileName, base64 } = await req.json();
    if (!fileName || !base64) {
      return NextResponse.json({ error: "fileName and base64 required" }, { status: 400 });
    }

    // Basic validation — images only, safe filename
    const safeName = String(fileName).replace(/[^a-zA-Z0-9._-]/g, "-");
    if (!/\.(png|jpe?g|gif|webp|avif|svg)$/i.test(safeName)) {
      return NextResponse.json({ error: "Only image files allowed" }, { status: 400 });
    }

    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${Date.now()}-${safeName}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Upload ${safeName}`,
          content: base64,
          branch: GITHUB_BRANCH,
        }),
      }
    );

    const data = await res.json();
    if (data.content?.download_url) {
      return NextResponse.json({ url: data.content.download_url });
    }
    return NextResponse.json({ error: data.message || "Upload failed" }, { status: 502 });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
