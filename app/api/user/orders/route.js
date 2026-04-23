import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Debug: log the email we're searching for
    console.log("Searching orders for email:", session.user.email);

    // Try to find ALL orders first to see what's in DB
    const allOrders = await Order.find().limit(5);
    console.log("Sample orders in DB:", JSON.stringify(allOrders.map(o => ({
      orderId: o.orderId,
      customerEmail: o.customer?.email,
      customer: o.customer,
    })), null, 2));

    const orders = await Order.find({ "customer.email": session.user.email })
      .sort({ createdAt: -1 })
      .limit(20);

    console.log("Matched orders count:", orders.length);

    return Response.json(orders);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}