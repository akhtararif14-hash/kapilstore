import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { phone, address, isJamiaStudent } = await req.json();
    await connectDB();

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { phone, address, isJamiaStudent },
      { new: true },
    );

    return Response.json({ success: true, user });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
