import crypto from "node:crypto";

function getSecret(): string {
  const secret = process.env.OTP_HMAC_SECRET;
  if (!secret) throw new Error("OTP_HMAC_SECRET is not configured.");
  return secret;
}

export function generateCode(): string {
  return String(crypto.randomInt(0, 1000000)).padStart(6, "0");
}

// Stateless OTP: the code itself is never sent back to the browser. Instead we
// hand the client an opaque token (expiry + HMAC of code+expiry). Verification
// recomputes the HMAC from the submitted code and compares — no database needed.
export function signOtp(code: string, expiresAt: number): string {
  const hmac = crypto.createHmac("sha256", getSecret()).update(`${code}.${expiresAt}`).digest("hex");
  return Buffer.from(`${expiresAt}.${hmac}`).toString("base64url");
}

export function verifyOtp(code: string, token: string): { ok: boolean; reason?: string } {
  let payload: string;
  try {
    payload = Buffer.from(token, "base64url").toString("utf8");
  } catch {
    return { ok: false, reason: "Invalid verification token." };
  }

  const [expiresAtStr, hmac] = payload.split(".");
  const expiresAt = Number(expiresAtStr);
  if (!expiresAt || !hmac) return { ok: false, reason: "Invalid verification token." };
  if (Date.now() > expiresAt) return { ok: false, reason: "Code expired. Please sign in again." };

  const expectedHmac = crypto.createHmac("sha256", getSecret()).update(`${code}.${expiresAt}`).digest("hex");
  const a = Buffer.from(hmac, "hex");
  const b = Buffer.from(expectedHmac, "hex");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return { ok: false, reason: "Incorrect verification code." };
  }
  return { ok: true };
}
