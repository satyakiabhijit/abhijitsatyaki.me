import { NextResponse } from "next/server";
import { generateCaptchaChallenge } from "@/app/lib/contact";

export const dynamic = "force-dynamic";

export async function GET() {
  const challenge = generateCaptchaChallenge();
  return NextResponse.json(challenge);
}
