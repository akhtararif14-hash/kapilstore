// app/food/page.js
export const metadata = {
  title: "Food | Kapil Store",
  description:
    "Order fast food, veg food, non-veg food, sweets, bakery items, ice cream and tiffin services. Fast delivery for Jamia students.",
  keywords: [
    "food delivery",
    "veg food",
    "non veg food",
    "fast food",
    "tiffin service",
    "jamia food",
    "kapil store food",
  ],
  alternates: { canonical: "/food" },
  openGraph: {
    title: "Food | Kapil Store",
    description:
      "Hot food delivered fast — veg, non-veg, fast food, tiffin & more.",
    url: "https://kapilstore.in/food",
    siteName: "Kapil Store",
    type: "website",
  },
};

import FoodClient from "./FoodClient";

export default function FoodPage() {
  return <FoodClient />;
}
