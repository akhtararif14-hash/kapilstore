import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      customer,
      cart,
      total,
      deliveryCharge,
      platformFee,
      deliverySlot,
      paymentMethod,
      paymentStatus,
      userId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      utrNumber,
    } = body;

    // ── Validation ───────────────────────────────────────────────
    if (!customer?.name || !customer?.phone || !customer?.address) {
      return Response.json(
        { message: "Missing required customer fields" },
        { status: 400 }
      );
    }
    if (!cart || cart.length === 0) {
      return Response.json({ message: "Cart is empty" }, { status: 400 });
    }
    if (!total || total <= 0) {
      return Response.json({ message: "Invalid order total" }, { status: 400 });
    }

    // ── Generate orderId and orderCategory ───────────────────────
    const orderId =
      "ORD-" +
      Date.now() +
      "-" +
      Math.random().toString(36).substring(2, 7).toUpperCase();
    const orderCategory = cart[0]?.category || "stationery";

    // ── Save order ───────────────────────────────────────────────
    const order = new Order({
      orderId,
      userId: userId || null,
      customer: {
        name: customer.name,
        phone: customer.phone,
        email: customer.email || "",
        address: customer.address,
        isJamiaStudent: customer.isJamiaStudent ?? false,
        timeSlot: deliverySlot || customer.timeSlot || "",
      },
      items: cart.map((item) => ({
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        description: item.description || "",
        category: item.category || "stationery",
      })),
      category: orderCategory,
      totalAmount: total,
      deliveryCharge: deliveryCharge ?? 0,
      platformFee: platformFee ?? 0,
      paymentMethod: paymentMethod || "razorpay",
      paymentStatus: paymentStatus || "pending_verification",
      utrNumber: utrNumber || null,
      razorpayOrderId: razorpayOrderId || null,
      razorpayPaymentId: razorpayPaymentId || null,
      razorpaySignature: razorpaySignature || null,
      trackingUpdates: [
        {
          status: "placed",
          message: "Order placed successfully",
          timestamp: new Date(),
        },
      ],
    });

    await order.save();

    // ── Send emails + Telegram (non-blocking) ────────────────────
    sendEmails({
      customer,
      cart,
      orderId,
      orderCategory,
      deliveryCharge,
      total,
      paymentMethod,
      utrNumber,
    }).catch((err) => console.error("Email error:", err));

    sendTelegramNotification({
      orderId,
      customer,
      total,
      paymentMethod,
      cart,
      deliveryCharge,
    }).catch((err) => console.error("Telegram error:", err));

    return Response.json(
      { message: "Order placed successfully", orderId },
      { status: 200 }
    );
  } catch (error) {
    console.error("Order API error:", error);
    return Response.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ── Telegram Notification ─────────────────────────────────────────
async function sendTelegramNotification({
  orderId,
  customer,
  total,
  paymentMethod,
  cart,
  deliveryCharge,
}) {
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) return;

  const isCOD = paymentMethod === "cod";

  const itemsList = cart
    .map(
      (item) =>
        "  • " +
        item.title +
        " x" +
        item.quantity +
        " = ₹" +
        item.price * item.quantity
    )
    .join("\n");

  const message = [
    "🛍️ *New Order — Kapil Store*",
    "",
    "📦 Order: `" + orderId + "`",
    "💳 Payment: " + (isCOD ? "💵 CASH ON DELIVERY" : "✅ PAID ONLINE"),
    "",
    "👤 *Customer*",
    "Name: " + customer.name,
    "Phone: " + customer.phone,
    "Email: " + (customer.email || "N/A"),
    "Jamia Student: " + (customer.isJamiaStudent ? "Yes" : "No"),
    "Address: " + customer.address,
    "",
    "🧾 *Items*",
    itemsList,
    "",
    "🚚 Delivery: ₹" + deliveryCharge,
    "💰 *Total: ₹" + total + "*",
    "",
    isCOD
      ? "⚠️ Collect ₹" + total + " cash at delivery"
      : "✅ Payment received",
  ].join("\n");

  await fetch(
    "https://api.telegram.org/bot" +
      process.env.TELEGRAM_BOT_TOKEN +
      "/sendMessage",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "Markdown",
      }),
    }
  );
}

// ── Email Helper ──────────────────────────────────────────────────
async function sendEmails({
  customer,
  cart,
  orderId,
  orderCategory,
  deliveryCharge,
  total,
  paymentMethod,
  utrNumber,
}) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  const isCOD = paymentMethod === "cod";

  const itemsList = cart
    .map(
      (item) =>
        item.title +
        " (Qty: " +
        item.quantity +
        ") - Rs." +
        item.price * item.quantity
    )
    .join("\n");

  // ── 1. Owner notification ─────────────────────────────────────
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: (isCOD ? "💵 New COD Order: " : "✅ New Online Order: ") + orderId,
    text: [
      isCOD
        ? "⚠️  CASH ON DELIVERY ORDER — Collect Rs." + total + " at delivery"
        : "✅ ONLINE PAYMENT ORDER",
      "",
      "Order ID: " + orderId,
      "Category: " + orderCategory,
      "Name: " + customer.name,
      "Phone: " + customer.phone,
      "Email: " + (customer.email || "N/A"),
      "Address: " + customer.address,
      "Jamia Student: " + (customer.isJamiaStudent ? "Yes" : "No"),
      "",
      "Items:",
      itemsList,
      "",
      "Delivery Charge: Rs." + deliveryCharge,
      "Total Amount: Rs." + total,
      "Payment: " + (paymentMethod || "razorpay").toUpperCase(),
      "UTR Number: " + (utrNumber || "N/A"),
      "Timestamp: " + new Date().toLocaleString(),
    ].join("\n"),
  });

  // ── 2. Customer confirmation email ────────────────────────────
  if (!customer.email) return;

  const itemRows = cart
    .map(
      (item) =>
        "<tr>" +
        '<td style="padding:8px 0;border-bottom:1px solid #ffffff15;font-size:14px;color:#f5f5f5cc;">' +
        item.title +
        " x " +
        item.quantity +
        "</td>" +
        '<td style="padding:8px 0;border-bottom:1px solid #ffffff15;font-size:14px;color:#f5f5f5cc;text-align:right;">' +
        "Rs." +
        item.price * item.quantity +
        "</td>" +
        "</tr>"
    )
    .join("");

  const deliveryCell =
    deliveryCharge === 0
      ? '<span style="color:#17d492;font-weight:bold;">FREE</span>'
      : "Rs." + deliveryCharge;

  const paymentBanner = isCOD
    ? '<div style="background:#fef9c3;border:1px solid #fde68a;border-radius:10px;padding:14px 18px;margin:0 0 20px;">' +
      '<p style="margin:0;font-size:14px;color:#92400e;font-weight:700;">💵 Cash on Delivery</p>' +
      '<p style="margin:6px 0 0;font-size:13px;color:#92400e;">Please keep <strong>Rs.' +
      total +
      "</strong> ready when your order arrives. Exact change preferred.</p>" +
      "</div>"
    : '<div style="background:#dcfce7;border:1px solid #bbf7d0;border-radius:10px;padding:14px 18px;margin:0 0 20px;">' +
      '<p style="margin:0;font-size:14px;color:#166534;font-weight:700;">✅ Payment Confirmed</p>' +
      '<p style="margin:6px 0 0;font-size:13px;color:#166534;">Your payment has been received. Your order is being processed.</p>' +
      "</div>";

  const year = new Date().getFullYear();

  const emailHtml =
    '<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;background:#22323c;color:#f5f5f5;border-radius:12px;overflow:hidden;">' +
    '<div style="background:#17d492;padding:28px 32px;">' +
    '<h1 style="margin:0;color:#22323c;font-size:24px;font-weight:900;">Order Confirmed!</h1>' +
    '<p style="margin:6px 0 0;color:#22323ccc;font-size:13px;">Thank you for shopping with Kapil Store</p>' +
    "</div>" +
    '<div style="padding:28px 32px;">' +
    '<p style="margin:0 0 6px;font-size:15px;">Hi <strong>' +
    customer.name +
    "</strong>,</p>" +
    '<p style="color:#f5f5f5cc;margin:0 0 24px;font-size:14px;line-height:1.6;">' +
    "Your order has been placed. We will contact you on " +
    '<strong style="color:#17d492;">' +
    customer.phone +
    "</strong> to confirm delivery." +
    "</p>" +
    '<div style="background:#1a2830;border-radius:10px;padding:16px 20px;margin:0 0 20px;border:1px solid #17d49230;">' +
    '<p style="margin:0 0 4px;font-size:11px;color:#17d492;font-weight:900;text-transform:uppercase;letter-spacing:1.5px;">Order ID</p>' +
    '<p style="margin:0;font-size:22px;font-weight:900;font-family:monospace;color:#fff;">' +
    orderId +
    "</p>" +
    "</div>" +
    paymentBanner +
    '<table style="width:100%;border-collapse:collapse;margin:0 0 8px;">' +
    itemRows +
    "<tr>" +
    '<td style="padding:8px 0;font-size:13px;color:#f5f5f5aa;">Delivery Charge</td>' +
    '<td style="padding:8px 0;font-size:13px;color:#f5f5f5aa;text-align:right;">' +
    deliveryCell +
    "</td>" +
    "</tr>" +
    "<tr>" +
    '<td style="padding:12px 0 0;font-size:16px;font-weight:900;color:#fff;border-top:1px solid #ffffff20;">' +
    (isCOD ? "Amount to Pay" : "Total Paid") +
    "</td>" +
    '<td style="padding:12px 0 0;font-size:16px;font-weight:900;color:#17d492;text-align:right;border-top:1px solid #ffffff20;">Rs.' +
    total +
    "</td>" +
    "</tr>" +
    "</table>" +
    '<a href="https://kapilstore.in/track/' +
    orderId +
    '"' +
    ' style="display:block;background:#17d492;color:#22323c;text-align:center;padding:16px;border-radius:10px;font-weight:900;text-decoration:none;font-size:16px;margin:24px 0 20px;">' +
    "Track Your Order" +
    "</a>" +
    '<p style="font-size:13px;color:#f5f5f5aa;margin:0;">' +
    'Need help? WhatsApp: <strong style="color:#17d492;">7982670413</strong>' +
    "</p>" +
    "</div>" +
    '<div style="background:#1a2830;padding:14px 32px;text-align:center;border-top:1px solid #ffffff10;">' +
    '<p style="margin:0;font-size:11px;color:#ffffff40;">&copy; ' +
    year +
    " Kapil Store &bull; kapilstore.in</p>" +
    "</div>" +
    "</div>";

  await transporter.sendMail({
    from: '"Kapil Store" <' + process.env.EMAIL_USER + ">",
    to: customer.email,
    subject:
      (isCOD ? "Order Confirmed (COD) - " : "Order Confirmed - ") +
      orderId +
      " | Kapil Store",
    html: emailHtml,
  });
}