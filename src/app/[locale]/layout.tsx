import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import Footer from "@/components/layout/Footer";


export const metadata: Metadata = {
  title: "Booking.com Clone",
  description: "A clone of Booking.com for hotel and accommodation reservations",
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return (

    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />
      <main className="flex-grow">
        <NuqsAdapter>
          {children}
        </NuqsAdapter>
      </main>
      <Footer />
    </div>
  );
}
