import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// import ClientOnly from "./Hydration";
import ReduxProvider from "@/providers/ReduxProvider";
import AuthInitializer from "@/AuthInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Exam Form Portal",
  description:
    "This exam form Portal for fill form for candidate registration.",
};

// 🛠️ Ye function async ban gaya ab
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ReduxProvider>
          <AuthInitializer /> {/* Yahi boss sab sambhalega */}
          <Navbar />
          <main className="flex-grow min-h-[calc(100vh-64px-96px)]">
            {children}
          </main>
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
