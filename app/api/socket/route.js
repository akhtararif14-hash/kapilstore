import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return Response.json(
      { error: "orderId required" },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    const order = await Order.findOne({ orderId });

    if (!order) {
      return Response.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return Response.json({
      orderId: order.orderId,
      status: order.status,
      trackingUpdates: order.trackingUpdates,
      deliveryLocation: order.deliveryLocation,
      estimatedDelivery: order.estimatedDelivery,
      customer: {
        name: order.customer?.name || "Unknown",
      },
    });
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}