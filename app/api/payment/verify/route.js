import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(req) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = await req.json();

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return Response.json({ error: "Invalid signature" }, { status: 400 });
    }

    await connectDB();
    await Order.findOneAndUpdate(
      { orderId },
      {
        paymentStatus: "paid",
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      }
    );

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Verification failed" }, { status: 500 });
  }
}
