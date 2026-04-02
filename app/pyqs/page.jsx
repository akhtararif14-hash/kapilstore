// app/pyqs/page.js
export const metadata = {
  title: "Previous Year Questions | Kapil Store",
  description:
    "Download previous year question papers department-wise for Jamia Millia Islamia and other universities. Free PYQs for all branches.",
  keywords: [
    "PYQ",
    "previous year questions",
    "jamia pyq",
    "question papers",
    "exam papers",
    "JMI previous year",
    "kapil store pyq",
  ],
  alternates: { canonical: "/pyqs" },
  openGraph: {
    title: "Previous Year Questions | Kapil Store",
    description:
      "Free PYQs for Jamia students — download department-wise question papers.",
    url: "https://kapilstore.in/pyqs",
    siteName: "Kapil Store",
    type: "website",
  },
};

import PYQClient from "./PYQClient";

export default function PYQPage() {
  return <PYQClient />;
}
