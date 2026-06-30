import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json({ ok: false, error: "ADMIN_PASSWORD not set" }, { status: 500 });
  }

  if (password === adminPassword) {
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, error: "密码错误" }, { status: 401 });
}
