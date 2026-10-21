import { sql } from "@/app/lib/db";
import crypto from "crypto";

export interface AdminUser {
  id: number;
  email: string;
  password_hash: string;
  salt: string;
  created_at: string;
}

export interface ResumeRecord {
  role: string;
  filename: string;
  mime_type: string;
  data_base64: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface BeyondDevItem {
  id: number;
  section: string;
  subsection: string | null;
  title: string;
  author: string | null;
  cover_image_url: string | null;
  download_url: string | null;
  description: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

const SALT = "abhijit-portfolio-admin-salt-2026";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

export function comparePassword(
  plain: string,
  hash: string,
  salt: string,
): boolean {
  try {
    const derived = crypto.scryptSync(plain, salt, 64).toString("hex");
    const a = Buffer.from(derived);
    const b = Buffer.from(hash);
    return (
      a.length === b.length &&
      crypto.timingSafeEqual(new Uint8Array(a), new Uint8Array(b))
    );
  } catch {
    return false;
  }
}

/**
 * Ensure the admin tables exist and carry the columns this app expects.
 * The database previously held a Vite-era schema, so we add anything missing
 * rather than recreating tables (which would drop uploaded resumes).
 */
export async function ensureAdminTables(): Promise<void> {
  try {
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

    await sql`
      CREATE TABLE IF NOT EXISTS beyond_dev_items (
        id SERIAL PRIMARY KEY,
        section TEXT NOT NULL DEFAULT 'Books',
        title TEXT NOT NULL,
        author TEXT,
        cover_image_url TEXT,
        download_url TEXT,
        description TEXT,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    await sql`ALTER TABLE beyond_dev_items ADD COLUMN IF NOT EXISTS section TEXT NOT NULL DEFAULT 'Books'`;
    await sql`ALTER TABLE beyond_dev_items ADD COLUMN IF NOT EXISTS subsection TEXT`;
    await sql`ALTER TABLE beyond_dev_items ADD COLUMN IF NOT EXISTS author TEXT`;
    await sql`ALTER TABLE beyond_dev_items ADD COLUMN IF NOT EXISTS cover_image_url TEXT`;
    await sql`ALTER TABLE beyond_dev_items ADD COLUMN IF NOT EXISTS download_url TEXT`;
    await sql`ALTER TABLE beyond_dev_items ADD COLUMN IF NOT EXISTS description TEXT`;
    await sql`ALTER TABLE beyond_dev_items ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0`;
  } catch (error) {
    console.error("Error ensuring admin tables:", error);
  }
}

export async function getAdminUserByEmail(
  email: string,
): Promise<AdminUser | null> {
  await ensureAdminTables();
  const rows = await sql`
    SELECT id, email, password_hash, salt, created_at
    FROM admin_users
    WHERE email = ${email}
  `;
  return (rows?.[0] as AdminUser) || null;
}

/**
 * Create (or reset) the admin user. Used by scripts/setup-admin.ts.
 */
export async function upsertAdminUser(
  email: string,
  password: string,
): Promise<void> {
  await ensureAdminTables();
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = hashPassword(password, salt);

  await sql`
    INSERT INTO admin_users (email, password_hash, salt)
    VALUES (${email}, ${hash}, ${salt})
    ON CONFLICT (email)
    DO UPDATE SET password_hash = ${hash}, salt = ${salt}
  `;
}

export async function createSession(
  userId: number,
): Promise<{ token: string; expiresAt: Date }> {
  await ensureAdminTables();
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await sql`
    INSERT INTO admin_sessions (token, user_id, expires_at)
    VALUES (${token}, ${userId}, ${expiresAt.toISOString()})
  `;

  return { token, expiresAt };
}

export async function validateSession(
  token: string,
): Promise<AdminUser | null> {
  await ensureAdminTables();
  const rows = await sql`
    SELECT u.id, u.email, u.salt, u.created_at
    FROM admin_sessions s
    JOIN admin_users u ON u.id = s.user_id
    WHERE s.token = ${token} AND s.expires_at > NOW()
  `;
  if (!rows || rows.length === 0) return null;

  // Extend session by 7 days so active sessions never unexpectedly expire
  await sql`
    UPDATE admin_sessions
    SET expires_at = NOW() + INTERVAL '7 days'
    WHERE token = ${token}
  `.catch(() => {});

  const row = rows[0] as AdminUser;
  return { ...row, password_hash: "" };
}

export async function destroySession(token: string): Promise<void> {
  await sql`DELETE FROM admin_sessions WHERE token = ${token}`;
}

export async function listResumes(): Promise<ResumeRecord[]> {
  await ensureAdminTables();
  const rows = await sql`
    SELECT role, filename, mime_type, data_base64, is_default, created_at, updated_at
    FROM resumes
    ORDER BY role ASC
  `;
  return (rows || []) as ResumeRecord[];
}

export async function getResumeByRole(
  role: string,
): Promise<ResumeRecord | null> {
  await ensureAdminTables();
  const rows = await sql`
    SELECT role, filename, mime_type, data_base64, is_default, created_at, updated_at
    FROM resumes
    WHERE role = ${role}
  `;
  return (rows?.[0] as ResumeRecord) || null;
}

export async function getDefaultResume(): Promise<ResumeRecord | null> {
  await ensureAdminTables();
  const rows = await sql`
    SELECT role, filename, mime_type, data_base64, is_default, created_at, updated_at
    FROM resumes
    WHERE is_default = TRUE
    LIMIT 1
  `;
  return (rows?.[0] as ResumeRecord) || null;
}

/**
 * Insert or replace the resume for a role. Uploading for a role that already
 * has a resume overwrites that one and leaves every other role untouched.
 */
export async function upsertResume(data: {
  role: string;
  filename: string;
  data_base64: string;
  mime_type?: string;
  is_default?: boolean;
}): Promise<ResumeRecord> {
  await ensureAdminTables();

  const makeDefault = data.is_default === true;
  if (makeDefault) {
    await sql`UPDATE resumes SET is_default = FALSE`;
  }

  const existing = await getResumeByRole(data.role);

  const rows = existing
    ? await sql`
        UPDATE resumes
        SET filename = ${data.filename},
            mime_type = ${data.mime_type || "application/pdf"},
            data_base64 = ${data.data_base64},
            is_default = CASE
              WHEN ${makeDefault} THEN TRUE
              ELSE is_default
            END,
            updated_at = NOW()
        WHERE role = ${data.role}
        RETURNING role, filename, mime_type, data_base64, is_default, created_at, updated_at
      `
    : await sql`
        INSERT INTO resumes (role, filename, mime_type, data_base64, is_default)
        VALUES (
          ${data.role},
          ${data.filename},
          ${data.mime_type || "application/pdf"},
          ${data.data_base64},
          ${makeDefault}
        )
        RETURNING role, filename, mime_type, data_base64, is_default, created_at, updated_at
      `;

  return (
    (rows?.[0] as ResumeRecord) || {
      role: data.role,
      filename: data.filename,
      mime_type: data.mime_type || "application/pdf",
      data_base64: data.data_base64,
      is_default: makeDefault,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  );
}

export async function setDefaultResume(role: string): Promise<void> {
  await ensureAdminTables();
  await sql`UPDATE resumes SET is_default = FALSE`;
  await sql`UPDATE resumes SET is_default = TRUE WHERE role = ${role}`;
}

export async function deleteResume(role: string): Promise<boolean> {
  await ensureAdminTables();
  const result = await sql`
    DELETE FROM resumes WHERE role = ${role} RETURNING role
  `;
  return (result?.length ?? 0) > 0;
}

export async function changePassword(
  userId: number,
  currentPassword: string,
  newPassword: string,
): Promise<{ success: boolean; error?: string }> {
  await ensureAdminTables();
  const rows = await sql`
    SELECT id, email, password_hash, salt, created_at
    FROM admin_users
    WHERE id = ${userId}
  `;
  const user = rows?.[0] as AdminUser | undefined;
  if (!user) return { success: false, error: "User not found" };

  if (!comparePassword(currentPassword, user.password_hash, user.salt)) {
    return { success: false, error: "Current password is incorrect" };
  }

  const salt = crypto.randomBytes(16).toString("hex");
  await sql`
    UPDATE admin_users
    SET password_hash = ${hashPassword(newPassword, salt)}, salt = ${salt}
    WHERE id = ${userId}
  `;

  // Invalidate other sessions so old tokens stop working.
  await sql`DELETE FROM admin_sessions WHERE user_id = ${userId}`;

  return { success: true };
}

export async function listBeyondDevItems(): Promise<BeyondDevItem[]> {
  await ensureAdminTables();
  const rows = await sql`
    SELECT id, section, subsection, title, author, cover_image_url, download_url, description, display_order, created_at, updated_at
    FROM beyond_dev_items
    ORDER BY section ASC, subsection ASC NULLS LAST, display_order ASC, id ASC
  `;
  return (rows || []) as BeyondDevItem[];
}

export async function createBeyondDevItem(data: {
  section: string;
  subsection?: string | null;
  title: string;
  author?: string | null;
  cover_image_url?: string | null;
  download_url?: string | null;
  description?: string | null;
  display_order?: number;
}): Promise<BeyondDevItem | null> {
  await ensureAdminTables();
  const rows = await sql`
    INSERT INTO beyond_dev_items (section, subsection, title, author, cover_image_url, download_url, description, display_order)
    VALUES (
      ${data.section || "Books"},
      ${data.subsection || null},
      ${data.title},
      ${data.author || null},
      ${data.cover_image_url || null},
      ${data.download_url || null},
      ${data.description || null},
      ${data.display_order ?? 0}
    )
    RETURNING id, section, subsection, title, author, cover_image_url, download_url, description, display_order, created_at, updated_at
  `;
  return (rows?.[0] as BeyondDevItem) || null;
}

export async function updateBeyondDevItem(
  id: number,
  data: {
    section?: string;
    subsection?: string | null;
    title?: string;
    author?: string | null;
    cover_image_url?: string | null;
    download_url?: string | null;
    description?: string | null;
    display_order?: number;
  },
): Promise<BeyondDevItem | null> {
  await ensureAdminTables();
  const rows = await sql`
    UPDATE beyond_dev_items
    SET section = COALESCE(${data.section}, section),
        subsection = CASE WHEN ${data.subsection !== undefined} THEN ${data.subsection} ELSE subsection END,
        title = COALESCE(${data.title}, title),
        author = CASE WHEN ${data.author !== undefined} THEN ${data.author} ELSE author END,
        cover_image_url = CASE WHEN ${data.cover_image_url !== undefined} THEN ${data.cover_image_url} ELSE cover_image_url END,
        download_url = CASE WHEN ${data.download_url !== undefined} THEN ${data.download_url} ELSE download_url END,
        description = CASE WHEN ${data.description !== undefined} THEN ${data.description} ELSE description END,
        display_order = COALESCE(${data.display_order}, display_order),
        updated_at = NOW()
    WHERE id = ${id}
    RETURNING id, section, subsection, title, author, cover_image_url, download_url, description, display_order, created_at, updated_at
  `;
  return (rows?.[0] as BeyondDevItem) || null;
}

export async function deleteBeyondDevItem(id: number): Promise<boolean> {
  await ensureAdminTables();
  const result = await sql`
    DELETE FROM beyond_dev_items WHERE id = ${id} RETURNING id
  `;
  return (result?.length ?? 0) > 0;
}
