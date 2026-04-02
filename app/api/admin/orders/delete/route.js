import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(req) {
  try {
    const adminKey = req.headers.get("x-admin-key");
    if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }
    const { orderId } = await req.json();
    if (!orderId) return new Response(JSON.stringify({ message: "Order ID required" }), { status: 400 });

    await connectDB();
    const result = await Order.deleteOne({ orderId });
    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ message: "Order not found" }), { status: 404 });
    }
    return new Response(JSON.stringify({ message: "Order deleted" }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Failed to delete order" }), { status: 500 });
  }
}
