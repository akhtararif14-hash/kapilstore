// app/others/page.js
export const metadata = {
  title: "Other Services | Kapil Store",
  description:
    "Assignment services, tuition, student rent hub, laundry, ironing, repair and much more for Jamia students.",
  alternates: { canonical: "/others" },
  openGraph: {
    title: "Other Services | Kapil Store",
    url: "https://kapilstore.in/others",
    siteName: "Kapil Store",
    type: "website",
  },
};

import { Suspense } from "react";
import OthersClient from "./OthersClient";

export default function OthersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#22323c] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#17d492] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <OthersClient />
    </Suspense>
  );
}
