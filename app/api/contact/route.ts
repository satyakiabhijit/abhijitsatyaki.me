import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/app/lib/db";
import { checkRateLimit, verifyCaptcha, sendContactEmail } from "@/app/lib/contact";

export const dynamic = "force-dynamic";

// Helper to extract client IP from Next.js request headers
function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

// In-memory burst protection for DDoS mitigation (e.g. max 10 requests per minute from an IP)
const burstProtectionMap = new Map<string, { count: number; resetTime: number }>();
const BURST_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_BURST_REQUESTS = 10;

function checkBurstDdos(ip: string): boolean {
  const now = Date.now();
  const entry = burstProtectionMap.get(ip);

  if (!entry || now > entry.resetTime) {
    burstProtectionMap.set(ip, { count: 1, resetTime: now + BURST_WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_BURST_REQUESTS) {
    return false;
  }

  entry.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    // 1. DDoS Burst Limiting
    if (!checkBurstDdos(ip)) {
      return NextResponse.json(
        {
          error: "High traffic detected. Please slow down and wait a minute before trying again.",
        },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const { name, email, subject, message, captchaAnswer, captchaToken, honeypot } = body;

    // 2. Honeypot check (anti-bot)
    // If the hidden field is filled, silently discard and return fake success to trick spam bots
    if (honeypot && String(honeypot).trim() !== "") {
      console.warn(`[Anti-Spam] Honeypot triggered by IP: ${ip}`);
      return NextResponse.json({
        success: true,
        message: "Your message has been sent successfully!",
      });
    }

    // 3. Validation
    const cleanName = typeof name === "string" ? name.trim() : "";
    const cleanEmail = typeof email === "string" ? email.trim() : "";
    const cleanSubject = typeof subject === "string" ? subject.trim() : "";
    const cleanMessage = typeof message === "string" ? message.trim() : "";

    if (!cleanName || cleanName.length < 2 || cleanName.length > 100) {
      return NextResponse.json(
        { error: "Please enter a valid name (2-100 characters)." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail) || cleanEmail.length > 200) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!cleanMessage || cleanMessage.length < 5 || cleanMessage.length > 5000) {
      return NextResponse.json(
        { error: "Message must be between 5 and 5,000 characters." },
        { status: 400 }
      );
    }

    // 4. Captcha Verification
    const captchaResult = verifyCaptcha(captchaToken, captchaAnswer);
    if (!captchaResult.valid) {
      return NextResponse.json(
        { error: captchaResult.error || "Security verification failed." },
        { status: 400 }
      );
    }

    // 5. Rate limit check (max 3 submissions per 10 mins per IP across memory and DB)
    const rateCheck = await checkRateLimit(ip);
    if (!rateCheck.allowed) {
      const remainingMinutes = rateCheck.remainingMs
        ? Math.ceil(rateCheck.remainingMs / 60000)
        : 10;
      return NextResponse.json(
        {
          error: `Rate limit reached. To prevent spam, please wait ${remainingMinutes} minute(s) before sending another message.`,
        },
        { status: 429 }
      );
    }

    // 6. Save message to Neon PostgreSQL database
    let savedId: string | null = null;
    try {
      const rows = await sql`
        INSERT INTO contact_submissions (name, email, subject, message, ip_address, email_sent)
        VALUES (${cleanName}, ${cleanEmail}, ${cleanSubject || null}, ${cleanMessage}, ${ip}, FALSE)
        RETURNING id
      `;
      if (rows && rows.length > 0) {
        savedId = rows[0].id;
      }
    } catch (dbError) {
      console.error("Failed to save contact submission to Neon database:", dbError);
      // We still try sending email even if DB error occurs
    }

    // 7. Dispatch Email to abhijitsatyaki29@gmail.com
    const emailSent = await sendContactEmail({
      name: cleanName,
      email: cleanEmail,
      subject: cleanSubject || "New Contact Message",
      message: cleanMessage,
      ip,
    });

    // Update email_sent status in DB if saved
    if (savedId && emailSent) {
      try {
        await sql`UPDATE contact_submissions SET email_sent = TRUE WHERE id = ${savedId}`;
      } catch (err) {
        console.warn("Could not update email_sent status in database:", err);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for reaching out! Your message has been received.",
    });
  } catch (err: any) {
    console.error("Unhandled contact submission error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while sending your message. Please try again later." },
      { status: 500 }
    );
  }
}
