export const metadata = {
  title: "Contact Kapil Store | Stationery & Assignment Support",
  description:
    "Contact Kapil Store for stationery orders, assignment help, bulk purchases, or support. We respond quickly to student queries.",
  keywords: [
    "contact kapil store",
    "stationery support",
    "assignment help contact",
    "kapil store contact",
  ],
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Kapil Store",
    description:
      "Have questions or need support? Contact Kapil Store for stationery and assignment services.",
    url: "https://kapilstore.in/contact",
    siteName: "Kapil Store",
    type: "website",
  },
};

import ContactClient from "./ContactClient";

export default function ContactPage() {
  return <ContactClient />;
}
