import { NextRequest, NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otp";

export async function POST(req: NextRequest) {
  const { code, otpToken } = await req.json().catch(() => ({}));
  if (!code || !otpToken) {
    return NextResponse.json({ error: "Missing code or verification token." }, { status: 400 });
  }

  const result = verifyOtp(String(code).trim(), otpToken);
  if (!result.ok) {
    return NextResponse.json({ error: result.reason }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
