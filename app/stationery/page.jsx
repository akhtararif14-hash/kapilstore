// app/stationery/page.js
export const metadata = {
  title: "Stationery | Kapil Store",
  description:
    "Buy all stationery items at lowest prices — notebooks, pens, drawing materials, calculators, BTech & Polytechnic materials and more. Fast delivery for Jamia students.",
  keywords: ["stationery", "notebooks", "pens", "calculators", "drawing materials", "jamia stationery", "kapil store"],
  alternates: { canonical: "/stationery" },
  openGraph: {
    title: "Stationery | Kapil Store",
    description: "All stationery at lowest prices with fast delivery for Jamia students.",
    url: "https://kapilstore.in/stationery",
    siteName: "Kapil Store",
    type: "website",
  },
};

import StationeryClient from "./StationeryClient";

export default function StationeryPage() {
  return <StationeryClient />;
}
