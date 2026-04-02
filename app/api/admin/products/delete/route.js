import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function POST(req) {
  const adminKey = req.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_KEY) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await req.json();
  await connectDB();
  await Product.findByIdAndDelete(id);
  return Response.json({ success: true });
}
