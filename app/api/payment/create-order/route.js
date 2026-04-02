import Razorpay from "razorpay";

export async function POST(req) {
  try {
    const { amount } = await req.json();

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: Math.round(amount * 100), // convert to paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    return Response.json(order);
  } catch (err) {
    console.error("Razorpay error:", err);
    return Response.json({ error: "Failed to create payment order" }, { status: 500 });
  }
}
