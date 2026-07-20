import { NextResponse } from "next/server";
import { generateCode, signOtp } from "@/lib/otp";

const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function POST() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId || !process.env.OTP_HMAC_SECRET) {
    // Not configured yet — the frontend falls back to the local demo code (123456).
    return NextResponse.json({ error: "Telegram OTP delivery is not configured on this server yet." }, { status: 501 });
  }

  const code = generateCode();
  const expiresAt = Date.now() + OTP_TTL_MS;
  const otpToken = signOtp(code, expiresAt);
  const text = `Your Northgate Bank verification code is ${code}. It expires in 5 minutes. Do not share this code with anyone.`;

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    const tgData = await tgRes.json();
    if (!tgRes.ok || !tgData.ok) {
      return NextResponse.json({ error: "Failed to send code via Telegram." }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ error: "Failed to reach Telegram." }, { status: 502 });
  }

  return NextResponse.json({ otpToken, expiresAt });
}
