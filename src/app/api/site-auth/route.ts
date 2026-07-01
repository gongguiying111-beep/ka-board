import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const sitePassword = process.env.SITE_PASSWORD || "quinn2026";

  if (password === sitePassword) {
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, error: "密码错误" }, { status: 401 });
}
