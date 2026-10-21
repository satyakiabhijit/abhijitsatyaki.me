import { type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import {
  validateSession,
  listBeyondDevItems,
  createBeyondDevItem,
  updateBeyondDevItem,
  deleteBeyondDevItem,
} from "@/app/lib/db/admin";

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

    const items = await listBeyondDevItems();
    return Response.json({ success: true, items });
  } catch (error) {
    console.error("Error listing beyond-dev items:", error);
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
    const { section, subsection, title, author, cover_image_url, download_url, description, display_order } = body;

    if (!title || !title.trim()) {
      return Response.json({ error: "Title is required" }, { status: 400 });
    }

    const item = await createBeyondDevItem({
      section: (section || "Books").trim(),
      subsection: subsection?.trim() || null,
      title: title.trim(),
      author: author?.trim() || null,
      cover_image_url: cover_image_url?.trim() || null,
      download_url: download_url?.trim() || null,
      description: description?.trim() || null,
      display_order: typeof display_order === "number" ? display_order : 0,
    });

    revalidatePath("/beyond-dev");

    return Response.json({ success: true, item });
  } catch (error) {
    console.error("Error creating beyond-dev item:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
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
    const { id, section, subsection, title, author, cover_image_url, download_url, description, display_order } = body;

    if (!id || typeof id !== "number") {
      return Response.json({ error: "Valid ID is required" }, { status: 400 });
    }

    const item = await updateBeyondDevItem(id, {
      section: section !== undefined ? section.trim() : undefined,
      subsection: subsection !== undefined ? (subsection ? subsection.trim() : null) : undefined,
      title: title !== undefined ? title.trim() : undefined,
      author: author !== undefined ? (author ? author.trim() : null) : undefined,
      cover_image_url: cover_image_url !== undefined ? (cover_image_url ? cover_image_url.trim() : null) : undefined,
      download_url: download_url !== undefined ? (download_url ? download_url.trim() : null) : undefined,
      description: description !== undefined ? (description ? description.trim() : null) : undefined,
      display_order: typeof display_order === "number" ? display_order : undefined,
    });

    if (!item) {
      return Response.json({ error: "Item not found" }, { status: 404 });
    }

    revalidatePath("/beyond-dev");

    return Response.json({ success: true, item });
  } catch (error) {
    console.error("Error updating beyond-dev item:", error);
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
    const { id } = body;

    if (!id || typeof id !== "number") {
      return Response.json({ error: "Valid ID is required" }, { status: 400 });
    }

    const deleted = await deleteBeyondDevItem(id);
    if (!deleted) {
      return Response.json({ error: "Item not found" }, { status: 404 });
    }

    revalidatePath("/beyond-dev");

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting beyond-dev item:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
