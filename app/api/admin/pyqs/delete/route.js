// app/api/admin/pyqs/delete/route.js

import { connectDB } from "@/lib/mongodb";
import PYQ from "@/models/PYQ";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    // Verify admin authentication
    const cookieStore = await cookies();
    const admin = cookieStore.get("admin");

    if (!admin || admin.value !== process.env.ADMIN_KEY) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await req.json();

    if (!id) {
      return Response.json(
        { error: "PYQ ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const pyq = await PYQ.findByIdAndDelete(id);

    if (!pyq) {
      return Response.json(
        { error: "PYQ not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "PYQ deleted successfully",
    });

  } catch (err) {
    console.error("Delete PYQ Error:", err);

    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}