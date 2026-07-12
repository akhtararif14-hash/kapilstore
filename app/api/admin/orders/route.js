import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // Check admin authentication
    const cookieStore = await cookies();
    const admin = cookieStore.get("admin");

    if (!admin || admin.value !== process.env.ADMIN_KEY) {
      return new Response(
        JSON.stringify({ message: "Unauthorized" }),
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Fetch orders
    const orders = await Order.find().sort({ createdAt: -1 });

    return new Response(
      JSON.stringify(orders),
      { status: 200 }
    );

  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({ message: "Failed to fetch orders" }),
      { status: 500 }
    );
  }
}