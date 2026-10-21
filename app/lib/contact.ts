import crypto from "crypto";
import nodemailer, { type Transporter } from "nodemailer";
import { sql } from "./db";

const CAPTCHA_SECRET = process.env.CAPTCHA_SECRET || "abhijit-portfolio-captcha-secret-key-2026";
const TARGET_EMAIL = "abhijitsatyaki29@gmail.com";

// In-memory sliding window rate limiter
const ipRequestMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 3; // max 3 messages per 10 minutes per IP

export interface CaptchaChallenge {
  image: string; // Base64 Data URI SVG image containing the captcha question
  token: string;
}

// Generate SVG image for the captcha challenge (prevents HTML scrapers from reading text)
function generateCaptchaSvg(text: string): string {
  const width = 150;
  const height = 44;

  let noiseLines = "";
  for (let i = 0; i < 5; i++) {
    const x1 = Math.floor(Math.random() * width);
    const y1 = Math.floor(Math.random() * height);
    const x2 = Math.floor(Math.random() * width);
    const y2 = Math.floor(Math.random() * height);
    const colors = ["#6366f1", "#818cf8", "#38bdf8", "#94a3b8", "#a855f7"];
    const stroke = colors[Math.floor(Math.random() * colors.length)];
    noiseLines += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="1.2" opacity="0.4" />`;
  }

  let noiseDots = "";
  for (let i = 0; i < 22; i++) {
    const cx = Math.floor(Math.random() * width);
    const cy = Math.floor(Math.random() * height);
    const r = (Math.random() * 1.5 + 0.5).toFixed(1);
    noiseDots += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#818cf8" opacity="0.35" />`;
  }

  const chars = text.split("");
  const startX = 14;
  const spacing = 17;
  const textElements = chars
    .map((char, i) => {
      const x = startX + i * spacing;
      const y = 29 + (Math.floor(Math.random() * 6) - 3);
      const angle = Math.floor(Math.random() * 18) - 9;
      const colors = ["#ffffff", "#e2e8f0", "#c7d2fe", "#93c5fd", "#f1f5f9"];
      const fill = colors[Math.floor(Math.random() * colors.length)];
      return `<text x="${x}" y="${y}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="21" font-weight="700" fill="${fill}" transform="rotate(${angle} ${x} ${y})">${char}</text>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="background:#18181b; border-radius:10px;">
    ${noiseLines}
    ${noiseDots}
    ${textElements}
  </svg>`;
}

export function generateCaptchaChallenge(): CaptchaChallenge {
  const num1 = Math.floor(Math.random() * 9) + 2; // 2 to 10
  const num2 = Math.floor(Math.random() * 9) + 1; // 1 to 9
  const timestamp = Date.now();

  const payload = `${num1}:${num2}:${timestamp}`;
  const signature = crypto
    .createHmac("sha256", CAPTCHA_SECRET)
    .update(payload)
    .digest("hex");

  const token = Buffer.from(`${payload}:${signature}`).toString("base64");
  const svg = generateCaptchaSvg(`${num1} + ${num2} = ?`);
  const image = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

  return {
    image,
    token,
  };
}

export function verifyCaptcha(token: string, answer: string): { valid: boolean; error?: string } {
  try {
    if (!token || !answer) {
      return { valid: false, error: "Please enter the captcha answer." };
    }

    const decoded = Buffer.from(token, "base64").toString("utf8");
    const [num1Str, num2Str, timestampStr, signature] = decoded.split(":");

    if (!num1Str || !num2Str || !timestampStr || !signature) {
      return { valid: false, error: "Invalid captcha token." };
    }

    // Verify signature
    const expectedPayload = `${num1Str}:${num2Str}:${timestampStr}`;
    const expectedSignature = crypto
      .createHmac("sha256", CAPTCHA_SECRET)
      .update(expectedPayload)
      .digest("hex");

    if (signature !== expectedSignature) {
      return { valid: false, error: "Captcha verification failed. Please try again." };
    }

    const timestamp = parseInt(timestampStr, 10);
    const now = Date.now();

    // Check expiration (10 minutes)
    if (now - timestamp > 10 * 60 * 1000) {
      return { valid: false, error: "Captcha expired. Please refresh and try again." };
    }

    // Velocity check (bot prevention: must take at least 1.5s to fill form)
    if (now - timestamp < 1500) {
      return { valid: false, error: "Form submitted too quickly. Please take a moment." };
    }

    const num1 = parseInt(num1Str, 10);
    const num2 = parseInt(num2Str, 10);
    const expectedAnswer = num1 + num2;

    if (parseInt(answer.trim(), 10) !== expectedAnswer) {
      return { valid: false, error: `Incorrect captcha answer. Please try again.` };
    }

    return { valid: true };
  } catch (error) {
    console.error("Captcha verification error:", error);
    return { valid: false, error: "Captcha verification error." };
  }
}

export async function checkRateLimit(ip: string): Promise<{ allowed: boolean; remainingMs?: number }> {
  const now = Date.now();

  // 1. In-memory check
  const timestamps = ipRequestMap.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldest = validTimestamps[0];
    const remainingMs = RATE_LIMIT_WINDOW_MS - (now - oldest);
    return { allowed: false, remainingMs };
  }

  // 2. Database check
  try {
    const dbCount = await sql`
      SELECT COUNT(*) as count 
      FROM contact_submissions 
      WHERE ip_address = ${ip} 
        AND created_at > NOW() - INTERVAL '10 minutes'
    `;
    const count = parseInt(dbCount?.[0]?.count || "0", 10);
    if (count >= MAX_REQUESTS_PER_WINDOW) {
      return { allowed: false, remainingMs: RATE_LIMIT_WINDOW_MS };
    }
  } catch (err) {
    console.warn("DB rate limit check warning:", err);
  }

  // Update memory store
  validTimestamps.push(now);
  ipRequestMap.set(ip, validTimestamps);

  return { allowed: true };
}

export async function sendContactEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  ip: string;
}): Promise<boolean> {
  const gmailUser = process.env.GMAIL_USER || process.env.EMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD;
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  // If no SMTP configured, we log and return false (submission is safely saved in Neon DB!)
  if (!gmailUser && !smtpHost) {
    console.log(
      `[Contact Form] No SMTP configured yet. Message saved to Neon database for ${data.name} (${data.email}).`
    );
    return false;
  }

  try {
    let transporter: Transporter;

    if (gmailUser && gmailPass) {
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      });
    } else {
      transporter = nodemailer.createTransport({
        host: smtpHost || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "587", 10),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
    }

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
        <div style="border-bottom: 2px solid #6366f1; padding-bottom: 16px; margin-bottom: 24px;">
          <h2 style="color: #1e1b4b; margin: 0; font-size: 22px;">New Contact Message</h2>
          <p style="color: #6b7280; margin: 4px 0 0 0; font-size: 14px;">Received from your portfolio website (abhijitsatyaki.me)</p>
        </div>

        <div style="margin-bottom: 20px;">
          <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">From</p>
          <p style="margin: 0; font-size: 16px; color: #111827; font-weight: 500;">${data.name} &lt;<a href="mailto:${data.email}" style="color: #4f46e5;">${data.email}</a>&gt;</p>
        </div>

        <div style="margin-bottom: 20px;">
          <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">Subject</p>
          <p style="margin: 0; font-size: 16px; color: #111827;">${data.subject || "No subject"}</p>
        </div>

        <div style="margin-bottom: 24px; background-color: #f9fafb; padding: 16px; border-radius: 8px; border-left: 4px solid #6366f1;">
          <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">Message</p>
          <p style="margin: 0; font-size: 15px; color: #374151; white-space: pre-wrap; line-height: 1.6;">${data.message}</p>
        </div>

        <div style="font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; padding-top: 16px;">
          <p style="margin: 0;">Sender IP: ${data.ip} | Sent via Portfolio Contact Service</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: gmailUser ? `"Portfolio Contact" <${gmailUser}>` : `"Portfolio Contact" <noreply@abhijitsatyaki.me>`,
      to: TARGET_EMAIL,
      replyTo: data.email,
      subject: `[Portfolio Contact] ${data.subject || "New Message"} - from ${data.name}`,
      text: `From: ${data.name} (${data.email})\nSubject: ${data.subject}\n\nMessage:\n${data.message}\n\nSender IP: ${data.ip}`,
      html: htmlContent,
    });

    console.log(`Email successfully dispatched to ${TARGET_EMAIL}`);
    return true;
  } catch (error) {
    console.error("Error sending contact email:", error);
    return false;
  }
}
