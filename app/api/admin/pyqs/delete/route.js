// app/api/admin/pyqs/delete/route.js
import { connectDB } from "@/lib/mongodb";
import PYQ from "@/models/PYQ";

export async function POST(req) {
  const adminKey = req.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_KEY) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();

  await connectDB();
  await PYQ.findByIdAndDelete(id);

  return Response.json({ success: true });
}
