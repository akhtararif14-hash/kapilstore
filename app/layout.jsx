import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SessionWrapper from "./components/SessionWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Kapil Store | Stationery, Groceries & Assignment Services",
    template: "%s | Kapil Store",
  },
  description:
    "Kapil Store is your one-stop destination for affordable stationery, groceries, notebooks, college assignments, and study essentials with fast delivery.",
  keywords: [
    "stationery store",
    "online stationery india",
    "college assignments",
    "notebooks",
    "exam supplies",
    "kapil store",
    "jamia students",
  ],
  metadataBase: new URL("https://kapilstore.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Kapil Store | Stationery, Groceries & Assignment Hub",
    description:
      "Buy affordable stationery, groceries and college assignments online from Kapil Store with fast delivery.",
    url: "https://kapilstore.in",
    siteName: "Kapil Store",
    images: [
      {
        url: "/newlogonav.png",
        width: 1200,
        height: 630,
        alt: "Kapil Store - Assignments & Stationery Hub",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kapil Store | Assignments & Stationery Hub",
    description:
      "Affordable stationery and groceries for students. Fast delivery across India.",
    images: ["/newlogonav.png"],
  },
  verification: {
    google: `${process.env.GOOGLE_SITE_VERIFICATION}`,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ backgroundColor: "#0d1f2d" }}>
      <head>
        {/*
         * ✅ FIX: White flash on refresh
         * This inline script runs BEFORE any CSS or React loads.
         * It sets the background instantly so the browser never
         * shows a white frame — not even for 1 millisecond.
         */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.style.backgroundColor = "#0d1f2d";`,
          }}
        />

        {/* Google tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-EDP43PMXHZ"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-EDP43PMXHZ');
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ backgroundColor: "#0d1f2d", color: "#f0f4f8", margin: 0 }}
      >
        <SessionWrapper>
          <CartProvider>
            <Navbar />
            {children}
            <Footer />
          </CartProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}