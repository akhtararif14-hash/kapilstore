import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
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

    const { id, ...updates } = await req.json();

    if (!id) {
      return Response.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const updated = await Product.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated) {
      return Response.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return Response.json(updated);

  } catch (err) {
    console.error("Update Product Error:", err);

    return Response.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}