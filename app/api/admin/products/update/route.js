import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function POST(req) {
  try {
    const adminKey = req.headers.get("x-admin-key");
    if (adminKey !== process.env.ADMIN_KEY) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, ...updates } = await req.json();

    await connectDB();

    const updated = await Product.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );

    return Response.json(updated);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}