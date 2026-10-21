import { type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { validateSession, setDefaultResume } from "@/app/lib/db/admin";

const ALLOWED_ROLES = ["frontend", "backend", "fullstack", "software-dev"];

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
    const { role } = body;

    if (!role || !ALLOWED_ROLES.includes(role)) {
      return Response.json({ error: "Invalid role" }, { status: 400 });
    }

    await setDefaultResume(role);
    revalidatePath("/");
    revalidatePath("/resume");

    return Response.json({ success: true, defaultRole: role });
  } catch (error) {
    console.error("Error setting default resume:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
