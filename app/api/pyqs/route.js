// app/api/pyqs/route.js
import { connectDB } from "@/lib/mongodb";
import PYQ from "../../../models/PYQ";

// GET all PYQs (public)
export async function GET() {
  try {
    await connectDB();
    const pyqs = await PYQ.find().sort({ createdAt: -1 });
    return Response.json(pyqs);
  } catch (error) {
    return Response.json({ error: "Failed to fetch PYQs" }, { status: 500 });
  }
}
