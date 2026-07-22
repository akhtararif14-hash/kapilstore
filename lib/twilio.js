import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const FROM = process.env.TWILIO_WHATSAPP_NUMBER;
const ADMIN = process.env.ADMIN_WHATSAPP_NUMBER;

// Customer Template SID
const CUSTOMER_TEMPLATE =
  "HXc9f5ac41120594082d53d92fb8458188";

// Admin Template SID
const ADMIN_TEMPLATE =
  "HX4b977f47474fc86aaf654709b37d44a4";

// Format phone number to WhatsApp E.164 format
function formatPhone(phone) {
  let number = String(phone).trim();

  // Remove everything except digits
  number = number.replace(/\D/g, "");

  // Remove leading 0
  if (number.startsWith("0")) {
    number = number.substring(1);
  }

  // If it's a 10-digit Indian number, add country code
  if (number.length === 10) {
    number = "91" + number;
  }

  // If it already starts with 91, keep it
  if (number.startsWith("91") && number.length === 12) {
    return `whatsapp:+${number}`;
  }

  throw new Error(`Invalid phone number: ${phone}`);
}

export async function sendCustomerWhatsApp({
  customer,
  orderId,
  total,
}) {
  try {
    const to = formatPhone(customer.phone);

    console.log("Customer Phone:", customer.phone);
console.log("Formatted Phone:", formatPhone(customer.phone));

    const message = await client.messages.create({
      from: FROM,
      to,
      contentSid: CUSTOMER_TEMPLATE,
      contentVariables: JSON.stringify({
        "1": customer.name,
        "2": orderId,
        "3": total.toString(),
      }),
    });

    console.log("Customer WhatsApp:", message.sid);
  } catch (err) {
    console.error("Customer WhatsApp Error:", err);
  }
}

export async function sendAdminWhatsApp({
  customer,
  orderId,
  total,
  paymentMethod,
}) {
  try {
    const message = await client.messages.create({
      from: FROM,
      to: ADMIN,
      contentSid: ADMIN_TEMPLATE,
      contentVariables: JSON.stringify({
        "1": orderId,
        "2": customer.name,
        "3": customer.phone,
        "4": total.toString(),
        "5": paymentMethod,
      }),
    });

    console.log("Admin WhatsApp:", message.sid);
  } catch (err) {
    console.error("Admin WhatsApp Error:", err);
  }
}