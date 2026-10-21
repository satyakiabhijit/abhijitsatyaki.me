import { type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import {
  validateSession,
  listResumes,
  upsertResume,
  deleteResume,
} from "@/app/lib/db/admin";

const ALLOWED_ROLES = ["frontend", "backend", "fullstack", "software-dev"];
const MAX_PDF_BYTES = 10 * 1024 * 1024; // 10 MB

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await validateSession(token);
    if (!user) {
      return Response.json({ error: "Invalid session" }, { status: 401 });
    }

    const resumes = await listResumes();
    return Response.json({
      success: true,
      resumes: resumes.map((r) => ({
        role: r.role,
        filename: r.filename,
        size: r.data_base64?.length || 0,
        is_default: r.is_default,
        created_at: r.created_at,
        updated_at: r.updated_at,
      })),
    });
  } catch (error) {
    console.error("Error listing resumes:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await validateSession(token);
    if (!user) {
      return Response.json({ error: "Invalid session" }, { status: 401 });
    }

    const body = await request.json();
    const { role, filename, data_base64, mime_type, is_default } = body;

    if (!role || !ALLOWED_ROLES.includes(role)) {
      return Response.json(
        { error: `Role must be one of: ${ALLOWED_ROLES.join(", ")}` },
        { status: 400 },
      );
    }

    if (!data_base64) {
      return Response.json({ error: "No file data provided" }, { status: 400 });
    }

    // ~4 base64 chars per 3 bytes
    if (data_base64.length * 0.75 > MAX_PDF_BYTES) {
      return Response.json(
        { error: "File is too large (max 10 MB)" },
        { status: 400 },
      );
    }

    // Verify it really is a PDF. 8 base64 chars decode to 6 bytes, which is
    // enough to cover the 5-byte "%PDF-" magic number.
    const header = Buffer.from(data_base64.slice(0, 8), "base64").toString(
      "latin1",
    );
    if (!header.startsWith("%PDF-")) {
      return Response.json({ error: "File is not a valid PDF" }, { status: 400 });
    }

    const record = await upsertResume({
      role,
      filename: filename || `${role}-resume.pdf`,
      data_base64,
      mime_type: mime_type || "application/pdf",
      is_default: !!is_default,
    });

    const resumes = await listResumes();
    const defaultResume = resumes.find((r) => r.is_default);

    revalidatePath("/");
    revalidatePath("/resume");

    return Response.json({
      success: true,
      resume: {
        role: record.role,
        filename: record.filename,
        is_default: record.is_default,
      },
      defaultRole: defaultResume ? defaultResume.role : null,
    });
  } catch (error) {
    console.error("Error uploading resume:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await validateSession(token);
    if (!user) {
      return Response.json({ error: "Invalid session" }, { status: 401 });
    }

    const body = await request.json();
    const { role } = body;

    if (!role || !ALLOWED_ROLES.includes(role)) {
      return Response.json({ error: "Invalid role" }, { status: 400 });
    }

    const deleted = await deleteResume(role);
    if (!deleted) {
      return Response.json({ error: "Resume not found" }, { status: 404 });
    }

    revalidatePath("/");
    revalidatePath("/resume");

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting resume:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
