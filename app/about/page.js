export const metadata = {
  title: "About Kapil Store | Affordable Stationery for Students",
  description:
    "Kapil Store is a student-focused stationery platform offering affordable prices, free delivery for Jamia students, and cash on delivery.",
  keywords: [
    "about kapil store",
    "student stationery store",
    "jamia stationery",
    "cheap stationery india",
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Kapil Store",
    description:
      "Learn about Kapil Store’s mission to provide affordable stationery and assignment essentials for students.",
    url: "https://kapilstore.in/about",
    siteName: "Kapil Store",
    type: "website",
  },
};

import AboutClient from "./AboutClient";

export default function AboutPage() {
  return <AboutClient />;
}
