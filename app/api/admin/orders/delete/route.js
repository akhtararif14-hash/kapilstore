import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    // Verify admin authentication
    const cookieStore = await cookies();
    const admin = cookieStore.get("admin");

    if (!admin || admin.value !== process.env.ADMIN_KEY) {
      return new Response(
        JSON.stringify({ message: "Unauthorized" }),
        { status: 401 }
      );
    }

    // Get request body
    const { orderId } = await req.json();

    if (!orderId) {
      return new Response(
        JSON.stringify({ message: "Order ID required" }),
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Delete order
    const result = await Order.deleteOne({ orderId });

    if (result.deletedCount === 0) {
      return new Response(
        JSON.stringify({ message: "Order not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Order deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete Order Error:", error);

    return new Response(
      JSON.stringify({ message: "Failed to delete order" }),
      { status: 500 }
    );
  }
}