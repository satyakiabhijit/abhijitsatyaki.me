/**
 * End-to-end test for the admin panel API.
 *
 * The real database is replaced with an in-memory fake so the test can run
 * anywhere without touching shared resources. The route handlers themselves
 * (auth, upload, replace, set-default, delete) are exercised exactly as the
 * browser would call them.
 *
 * Usage:
 *   npx tsx scripts/test-admin-flow.ts
 */
import path from "path";

const ROOT = path.join(__dirname, "..");

// ---------------------------------------------------------------------------
// In-memory fake for @/app/lib/db
// ---------------------------------------------------------------------------

type Row = Record<string, any>;

const tables: Record<string, Row[]> = {
  admin_users: [],
  admin_sessions: [],
  resumes: [],
};

let nextId = 1;

function matchSql(query: string): string {
  return query.replace(/\s+/g, " ").trim();
}

async function fakeSql(strings: TemplateStringsArray, ...values: any[]): Promise<Row[]> {
  const query = matchSql(strings.join("?"));
  const v = values as any[];

  // --- DDL (no-ops in the fake) ---
  if (/^(CREATE|ALTER|DELETE) TABLE/i.test(query)) return [];
  if (/^DELETE FROM admin_sessions WHERE expires_at/i.test(query)) return [];

  if (/^INSERT INTO admin_users/i.test(query)) {
    const row = {
      id: nextId++,
      email: v[0],
      password_hash: v[1],
      salt: v[2],
      created_at: new Date().toISOString(),
    };
    tables.admin_users.push(row);
    return [row];
  }

  if (/^SELECT id, email, password_hash, salt, created_at FROM admin_users WHERE email/i.test(query)) {
    return tables.admin_users.filter((r) => r.email === v[0]);
  }

  if (/^SELECT id, email, password_hash, salt, created_at FROM admin_users WHERE id/i.test(query)) {
    return tables.admin_users.filter((r) => r.id === v[0]);
  }

  if (/^UPDATE admin_users SET password_hash/i.test(query)) {
    const row = tables.admin_users.find((r) => r.id === v[0]);
    if (row) {
      row.password_hash = v[1];
      row.salt = v[2];
    }
    return [];
  }

  if (/^INSERT INTO admin_sessions/i.test(query)) {
    const row = {
      id: nextId++,
      token: v[0],
      user_id: v[1],
      expires_at: v[2],
      created_at: new Date().toISOString(),
    };
    tables.admin_sessions.push(row);
    return [row];
  }

  if (/^SELECT u\.id, u\.email, u\.salt, u\.created_at FROM admin_sessions/i.test(query)) {
    const session = tables.admin_sessions.find((s) => s.token === v[0]);
    if (!session) return [];
    if (new Date(session.expires_at).getTime() <= Date.now()) return [];
    const user = tables.admin_users.find((u) => u.id === session.user_id);
    return user
      ? [
          {
            id: user.id,
            email: user.email,
            salt: user.salt,
            created_at: user.created_at,
          },
        ]
      : [];
  }

  if (/^DELETE FROM admin_sessions WHERE token/i.test(query)) {
    tables.admin_sessions = tables.admin_sessions.filter((s) => s.token !== v[0]);
    return [];
  }

  if (/^DELETE FROM admin_sessions WHERE user_id/i.test(query)) {
    tables.admin_sessions = tables.admin_sessions.filter((s) => s.user_id !== v[0]);
    return [];
  }

  if (/^SELECT role, filename, mime_type, data_base64, is_default, created_at, updated_at FROM resumes ORDER BY role/i.test(query)) {
    return [...tables.resumes].sort((a, b) => a.role.localeCompare(b.role));
  }

  if (/^SELECT role, filename, mime_type, data_base64, is_default, created_at, updated_at FROM resumes WHERE role/i.test(query)) {
    return tables.resumes.filter((r) => r.role === v[0]);
  }

  if (/^SELECT role, filename, mime_type, data_base64, is_default, created_at, updated_at FROM resumes WHERE is_default/i.test(query)) {
    return tables.resumes.filter((r) => r.is_default).slice(0, 1);
  }

  if (/^UPDATE resumes SET is_default = FALSE$/i.test(query)) {
    tables.resumes.forEach((r) => {
      r.is_default = false;
    });
    return [];
  }

  if (/^UPDATE resumes SET is_default = TRUE WHERE role/i.test(query)) {
    const row = tables.resumes.find((r) => r.role === v[0]);
    if (row) row.is_default = true;
    return [];
  }

  if (/^UPDATE resumes SET filename/i.test(query)) {
    // Params: filename, mime_type, data_base64, makeDefault, role
    const row = tables.resumes.find((r) => r.role === v[4]);
    if (!row) return [];
    row.filename = v[0];
    row.mime_type = v[1];
    row.data_base64 = v[2];
    if (v[3] === true) row.is_default = true;
    row.updated_at = new Date().toISOString();
    return [row];
  }

  if (/^INSERT INTO resumes/i.test(query)) {
    const row = {
      role: v[0],
      filename: v[1],
      mime_type: v[2],
      data_base64: v[3],
      is_default: v[4],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    tables.resumes.push(row);
    return [row];
  }

  if (/^DELETE FROM resumes WHERE role/i.test(query)) {
    const before = tables.resumes.length;
    tables.resumes = tables.resumes.filter((r) => r.role !== v[0]);
    return before === tables.resumes.length ? [] : [{ role: v[0] }];
  }

  throw new Error(`Fake DB does not handle: ${query}`);
}

// Replace the db module in the require cache before anything imports it, so
// the admin module picks up the in-memory fake instead of Neon.
const dbPath = require.resolve(path.join(ROOT, "app/lib/db.ts"));
require.cache[dbPath] = {
  id: dbPath,
  filename: dbPath,
  loaded: true,
  exports: { sql: fakeSql },
  children: [],
  paths: [],
} as unknown as NodeJS.Module;

// ---------------------------------------------------------------------------
// Test harness
// ---------------------------------------------------------------------------

let failures = 0;
function check(label: string, ok: boolean, extra = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${extra ? ` — ${extra}` : ""}`);
  if (!ok) failures++;
}

function makePdf(label: string): Buffer {
  const content = `BT /F1 24 Tf 72 700 Td (${label}) Tj ET`;
  return Buffer.from(
    `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n` +
      `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n` +
      `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n` +
      `4 0 obj\n<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj\n` +
      `5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n` +
      `trailer\n<< /Root 1 0 R /Size 6 >>\n%%EOF\n`,
    "latin1",
  );
}

function callRoute(
  handler: (req: any, ctx?: any) => Promise<Response>,
  req: Request,
  ctx?: any,
) {
  return handler(req, ctx);
}

async function main() {
  const { NextRequest } = require("next/server");
  const authRoute = require(path.join(ROOT, "app/api/admin/auth/route.ts"));
  const resumesRoute = require(path.join(ROOT, "app/api/admin/resumes/route.ts"));
  const defaultRoute = require(
    path.join(ROOT, "app/api/admin/resumes/default/route.ts"),
  );
  const resumeRoute = require(path.join(ROOT, "app/resume/route.ts"));
  const resumeRoleRoute = require(path.join(ROOT, "app/resume/[role]/route.ts"));

  const json = (body: any, headers: Record<string, string> = {}) =>
    new NextRequest("http://localhost/api", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
    });

  const get = (url: string, headers: Record<string, string> = {}) =>
    new NextRequest(url, { headers });

  const EMAIL = "smoke@test.local";
  const PASSWORD = "smoke-password";

  // Seed a user with the same scrypt scheme the app uses.
  const crypto = require("crypto");
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(PASSWORD, salt, 64).toString("hex");
  tables.admin_users.push({
    id: nextId++,
    email: EMAIL,
    password_hash: hash,
    salt,
    created_at: new Date().toISOString(),
  });

  // 1. Unauthenticated access is rejected
  const noAuthList = await callRoute(resumesRoute.GET, get("http://localhost/api"));
  check("list without token -> 401", noAuthList.status === 401);

  const noAuthUpload = await callRoute(
    resumesRoute.POST,
    json({ role: "frontend", data_base64: makePdf("x").toString("base64") }),
  );
  check("upload without token -> 401", noAuthUpload.status === 401);

  // 2. Login
  const loginRes = await callRoute(
    authRoute.POST,
    json({ email: EMAIL, password: PASSWORD }),
  );
  const login = await loginRes.json();
  check("login succeeds", loginRes.ok && !!login.token, `status=${loginRes.status}`);
  if (!login.token) {
    console.log("\nCannot continue without a token");
    process.exit(1);
  }
  const auth = { Authorization: `Bearer ${login.token}` };

  // 3. Wrong password rejected
  const badRes = await callRoute(
    authRoute.POST,
    json({ email: EMAIL, password: "nope" }),
  );
  check("wrong password -> 401", badRes.status === 401);

  // 4. Unknown email rejected
  const unknownRes = await callRoute(
    authRoute.POST,
    json({ email: "nobody@test.local", password: PASSWORD }),
  );
  check("unknown email -> 401", unknownRes.status === 401);

  // 5. Session verification
  const verifyRes = await callRoute(
    authRoute.GET,
    get("http://localhost/api", auth),
  );
  const verify = await verifyRes.json();
  check("session verifies", verifyRes.ok && verify.authenticated === true);

  // 6. Upload frontend
  const up1 = await callRoute(
    resumesRoute.POST,
    json(
      {
        role: "frontend",
        filename: "frontend-resume.pdf",
        mime_type: "application/pdf",
        data_base64: makePdf("Frontend Resume v1").toString("base64"),
      },
      auth,
    ),
  );
  const up1Body = await up1.json();
  check("upload frontend", up1.ok && up1Body.success, JSON.stringify(up1Body).slice(0, 140));

  // 7. Upload backend
  const up2 = await callRoute(
    resumesRoute.POST,
    json(
      {
        role: "backend",
        filename: "backend-resume.pdf",
        mime_type: "application/pdf",
        data_base64: makePdf("Backend Resume v1").toString("base64"),
      },
      auth,
    ),
  );
  check("upload backend", up2.ok);

  // 8. Replace frontend
  const up3 = await callRoute(
    resumesRoute.POST,
    json(
      {
        role: "frontend",
        filename: "frontend-resume.pdf",
        mime_type: "application/pdf",
        data_base64: makePdf("Frontend Resume v2 REPLACED").toString("base64"),
      },
      auth,
    ),
  );
  check("re-upload frontend (replace)", up3.ok);
  const feRowAfter = tables.resumes.find((r) => r.role === "frontend");
  const feDecoded = feRowAfter?.data_base64
    ? Buffer.from(feRowAfter.data_base64, "base64").toString("latin1")
    : "";
  check(
    "replaced base64 now stored",
    feDecoded.includes("REPLACED"),
    `decoded=${feDecoded.slice(0, 0) === "" ? "empty" : "ok"}`,
  );

  // 9. List shows one row per role
  const listRes = await callRoute(
    resumesRoute.GET,
    get("http://localhost/api", auth),
  );
  const list = await listRes.json();
  const roles = (list.resumes || []).map((r: any) => r.role).sort();
  check(
    "one row per role, both present",
    roles.length === 2 && roles[0] === "backend" && roles[1] === "frontend",
    JSON.stringify(roles),
  );

  // 10. Frontend serves the REPLACED file
  const serveFe = await callRoute(
    resumeRoleRoute.GET,
    get("http://localhost/resume/frontend"),
    { params: Promise.resolve({ role: "frontend" }) },
  );
  const feText = await serveFe.text();
  check(
    "frontend serves replaced file",
    serveFe.ok && feText.includes("REPLACED"),
    `status=${serveFe.status}`,
  );

  // 11. Backend untouched by the frontend re-upload
  const serveBe = await callRoute(
    resumeRoleRoute.GET,
    get("http://localhost/resume/backend"),
    { params: Promise.resolve({ role: "backend" }) },
  );
  const beText = await serveBe.text();
  check(
    "backend untouched by frontend re-upload",
    serveBe.ok && beText.includes("Backend Resume v1") && !beText.includes("REPLACED"),
  );

  // 12. Set backend as default
  const defRes = await callRoute(
    defaultRoute.POST,
    json({ role: "backend" }, auth),
  );
  const defBody = await defRes.json();
  check("set default -> backend", defRes.ok && defBody.defaultRole === "backend");

  // 13. Exactly one default
  const list2 = await callRoute(
    resumesRoute.GET,
    get("http://localhost/api", auth),
  );
  const list2Body = await list2.json();
  const defaults = (list2Body.resumes || []).filter((r: any) => r.is_default);
  check(
    "exactly one default",
    defaults.length === 1 && defaults[0].role === "backend",
    `count=${defaults.length}`,
  );

  // 14. /resume serves the default
  const serveDefault = await callRoute(
    resumeRoute.GET,
    get("http://localhost/resume"),
  );
  const defaultText = await serveDefault.text();
  check(
    "/resume serves the default (backend)",
    serveDefault.ok && defaultText.includes("Backend Resume v1"),
    `status=${serveDefault.status}`,
  );

  // 15. Switch default to frontend
  const def2 = await callRoute(
    defaultRoute.POST,
    json({ role: "frontend" }, auth),
  );
  check("switch default -> frontend", def2.ok);
  const serveDefault2 = await callRoute(
    resumeRoute.GET,
    get("http://localhost/resume"),
  );
  const defaultText2 = await serveDefault2.text();
  check("/resume now serves frontend", defaultText2.includes("REPLACED"));

  // 16. Non-PDF rejected
  const badPdf = await callRoute(
    resumesRoute.POST,
    json(
      {
        role: "fullstack",
        filename: "x.pdf",
        data_base64: Buffer.from("not a pdf").toString("base64"),
      },
      auth,
    ),
  );
  check("non-PDF rejected -> 400", badPdf.status === 400);

  // 17. Unknown role rejected
  const badRole = await callRoute(
    resumesRoute.POST,
    json(
      {
        role: "hacker",
        filename: "x.pdf",
        data_base64: makePdf("x").toString("base64"),
      },
      auth,
    ),
  );
  check("unknown role rejected -> 400", badRole.status === 400);

  // 18. Missing data rejected
  const noData = await callRoute(
    resumesRoute.POST,
    json({ role: "fullstack" }, auth),
  );
  check("missing file data rejected -> 400", noData.status === 400);

  // 19. Delete frontend
  const delRes = await callRoute(
    resumesRoute.DELETE,
    json({ role: "frontend" }, auth),
  );
  check("delete frontend", delRes.ok);
  const list3 = await callRoute(
    resumesRoute.GET,
    get("http://localhost/api", auth),
  );
  const list3Body = await list3.json();
  const roles3 = (list3Body.resumes || []).map((r: any) => r.role);
  check(
    "only backend remains after delete",
    roles3.length === 1 && roles3[0] === "backend",
    JSON.stringify(roles3),
  );

  // 20. Deleting a role with no resume -> 404
  const delMissing = await callRoute(
    resumesRoute.DELETE,
    json({ role: "fullstack" }, auth),
  );
  check("delete missing role -> 404", delMissing.status === 404);

  // 21. Logout invalidates the session
  const logoutRes = await callRoute(
    authRoute.DELETE,
    new NextRequest("http://localhost/api", { method: "DELETE", headers: auth }),
  );
  check("logout succeeds", logoutRes.ok);
  const afterLogout = await callRoute(
    authRoute.GET,
    get("http://localhost/api", auth),
  );
  check("token rejected after logout", afterLogout.status === 401);

  console.log(
    failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`,
  );
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error("Test crashed:", e);
  process.exit(1);
});
