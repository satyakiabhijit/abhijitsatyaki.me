/**
 * Create or reset the admin user used by /admin.
 *
 * Usage:
 *   npx tsx scripts/setup-admin.ts <email> <password>
 *
 * The password is salted and hashed with scrypt before it is stored, so it is
 * never written to the database in plain text.
 */
import { neon } from "@neondatabase/serverless";
import crypto from "crypto";
import fs from "fs";
import path from "path";

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

const SALT = "abhijit-portfolio-admin-salt-2026";

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

async function main() {
  const [email, password] = process.argv.slice(2);

  if (!email || !password) {
    console.error("Usage: npx tsx scripts/setup-admin.ts <email> <password>");
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set. Add it to .env.local first.");
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);

  await sql`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS salt TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW()`;

  await sql`
    CREATE TABLE IF NOT EXISTS resumes (
      role TEXT PRIMARY KEY,
      filename TEXT NOT NULL,
      mime_type TEXT DEFAULT 'application/pdf',
      data_base64 TEXT,
      is_default BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`ALTER TABLE resumes ADD COLUMN IF NOT EXISTS data_base64 TEXT`;
  await sql`ALTER TABLE resumes ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT FALSE`;
  await sql`ALTER TABLE resumes ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW()`;
  await sql`ALTER TABLE resumes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW()`;
  await sql`ALTER TABLE resumes ADD COLUMN IF NOT EXISTS mime_type TEXT DEFAULT 'application/pdf'`;

  await sql`
    CREATE TABLE IF NOT EXISTS admin_sessions (
      id SERIAL PRIMARY KEY,
      token TEXT UNIQUE NOT NULL,
      user_id INTEGER REFERENCES admin_users(id),
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  const salt = crypto.randomBytes(16).toString("hex");
  const hash = hashPassword(password, salt);

  await sql`
    INSERT INTO admin_users (email, password_hash, salt)
    VALUES (${email}, ${hash}, ${salt})
    ON CONFLICT (email)
    DO UPDATE SET password_hash = ${hash}, salt = ${salt}
  `;

  // Drop sessions so the new password takes effect immediately.
  await sql`DELETE FROM admin_sessions`;

  console.log(`Admin user "${email}" is ready. Log in at /admin.`);
}

main().catch((error) => {
  console.error("Failed to set up admin user:", error);
  process.exit(1);
});
