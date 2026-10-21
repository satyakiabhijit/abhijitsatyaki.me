import { type NextRequest } from "next/server";
import {
  getAdminUserByEmail,
  createSession,
  validateSession,
  destroySession,
  comparePassword,
  changePassword,
  listResumes,
} from "@/app/lib/db/admin";

const ADMIN_ROLES = ["frontend", "backend", "fullstack", "software-dev"];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, action } = body;

    // Change password
    if (action === "change-password") {
      const token = request.headers.get("Authorization")?.replace("Bearer ", "");
      if (!token) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }

      const sessionUser = await validateSession(token);
      if (!sessionUser) {
        return Response.json({ error: "Invalid session" }, { status: 401 });
      }

      const { currentPassword, newPassword } = body;
      if (!currentPassword || !newPassword) {
        return Response.json(
          { error: "Current and new password are required" },
          { status: 400 },
        );
      }

      const result = await changePassword(
        sessionUser.id,
        currentPassword,
        newPassword,
      );
      if (!result.success) {
        return Response.json({ error: result.error }, { status: 401 });
      }

      return Response.json({ success: true });
    }

    if (!email || !password) {
      return Response.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const user = await getAdminUserByEmail(email);
    if (!user) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (!comparePassword(password, user.password_hash, user.salt)) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const { token, expiresAt } = await createSession(user.id);
    return Response.json({
      success: true,
      token,
      expiresAt: expiresAt.toISOString(),
      user: { email: user.email },
      roles: ADMIN_ROLES,
    });
  } catch (error) {
    console.error("Auth error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return Response.json({ authenticated: false }, { status: 401 });
    }

    const user = await validateSession(token);
    if (!user) {
      return Response.json({ authenticated: false }, { status: 401 });
    }

    const resumes = await listResumes();
    const defaultResume = resumes.find((r) => r.is_default);

    return Response.json({
      authenticated: true,
      user: { email: user.email },
      roles: ADMIN_ROLES,
      defaultRole: defaultResume ? defaultResume.role : null,
    });
  } catch (error) {
    console.error("Session validation error:", error);
    return Response.json({ authenticated: false }, { status: 401 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await destroySession(token);
    return Response.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
