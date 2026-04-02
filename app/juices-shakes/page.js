// app/juices-shakes/page.js
export const metadata = {
  title: "Juices & Shakes | Kapil Store",
  description:
    "Order fresh juices, shakes, milkshakes, tea, coffee, cold drinks and mocktails. Fast delivery for Jamia students.",
  keywords: [
    "fresh juice",
    "shakes",
    "milkshakes",
    "tea coffee",
    "cold drinks",
    "mocktails",
    "jamia drinks",
    "kapil store",
  ],
  alternates: { canonical: "/juices-shakes" },
  openGraph: {
    title: "Juices & Shakes | Kapil Store",
    description:
      "Fresh juices, shakes, tea, coffee & cold drinks — delivered fast.",
    url: "https://kapilstore.in/juices-shakes",
    siteName: "Kapil Store",
    type: "website",
  },
};

import JuicesClient from "./JuicesClient";

export default function JuicesPage() {
  return <JuicesClient />;
}
