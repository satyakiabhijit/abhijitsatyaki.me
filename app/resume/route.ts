import { type NextRequest } from "next/server";
import { getDefaultResume } from "@/app/lib/db/admin";

export async function GET(request: NextRequest) {
  const download = request.nextUrl.searchParams.get("download") === "1";

  try {
    const def = await getDefaultResume();
    if (!def) {
      return new Response("No default resume has been set", { status: 404 });
    }

    const buffer = Buffer.from(def.data_base64, "base64");
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": String(buffer.length),
        "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${def.filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error serving default resume:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
