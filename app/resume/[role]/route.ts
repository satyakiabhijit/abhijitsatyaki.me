import { type NextRequest } from "next/server";
import { getResumeByRole, getDefaultResume } from "@/app/lib/db/admin";

const ALLOWED_ROLES = ["frontend", "backend", "fullstack", "software-dev"];

function pdfResponse(base64: string, filename: string, download: boolean) {
  const buffer = Buffer.from(base64, "base64");
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(buffer.length),
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ role: string }> },
) {
  const { role } = await params;
  const download = request.nextUrl.searchParams.get("download") === "1";

  try {
    // "/resume" with no role -> serve the default resume
    let targetRole = role;
    if (!targetRole || targetRole === "default") {
      const def = await getDefaultResume();
      if (!def) {
        return new Response("No default resume has been set", { status: 404 });
      }
      return pdfResponse(def.data_base64, def.filename, download);
    }

    if (!ALLOWED_ROLES.includes(targetRole)) {
      return new Response("Unknown resume role", { status: 404 });
    }

    const record = await getResumeByRole(targetRole);
    if (!record) {
      return new Response("Resume not found", { status: 404 });
    }

    return pdfResponse(record.data_base64, record.filename, download);
  } catch (error) {
    console.error("Error serving resume:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
