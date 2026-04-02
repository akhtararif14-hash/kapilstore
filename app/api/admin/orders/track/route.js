import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

const STATUS_MESSAGES = {
  placed: "Order placed successfully",
  confirmed: "Order confirmed by store",
  preparing: "Order is being prepared",
  out_for_delivery: "Order is out for delivery",
  delivered: "Order delivered successfully",
  cancelled: "Order has been cancelled",
};

export async function POST(req) {
  try {
    const adminKey = req.headers.get("x-admin-key");
    if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, status, lat, lng, message } = await req.json();
    if (!orderId || !status) {
      return Response.json({ error: "orderId and status required" }, { status: 400 });
    }

    await connectDB();

    const trackingEntry = {
      status,
      message: message || STATUS_MESSAGES[status] || status,
      timestamp: new Date(),
    };
    if (lat && lng) trackingEntry.location = { lat, lng };

    const updateOp = {
      status,
      $push: { trackingUpdates: trackingEntry },
    };
    if (lat && lng) updateOp.deliveryLocation = { lat, lng };

    const order = await Order.findOneAndUpdate({ orderId }, updateOp, { new: true });
    if (!order) return Response.json({ error: "Order not found" }, { status: 404 });

    return Response.json({ success: true, order });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
