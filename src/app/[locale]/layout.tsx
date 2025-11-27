import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import Footer from "@/components/layout/Footer";
import { WebVitals } from "@/components/WebVitals";

export const metadata: Metadata = {
  title: {
    template: '%s | Evasion',
    default: 'Evasion',
  },
  description: "Book leisure, hotel stays & travel in a few clicks. Hotels, activities & getaways across France. Évasion, your expert in well-being and discovery.",
  openGraph: {
    title: 'Evasion',
    description: 'Book leisure, hotel stays & travel in a few clicks. Hotels, activities & getaways across France. Évasion, your expert in well-being and discovery.',
    url: 'https://evasion.com',
    siteName: 'Evasion',
    images: [
      {
        url: 'https://evasion.com/og-image.jpg', // Placeholder
        width: 1200,
        height: 630,
      },
    ],
    locale: 'fr',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Evasion',
    description: 'Book leisure, hotel stays & travel in a few clicks. Hotels, activities & getaways across France. Évasion, your expert in well-being and discovery.',
    creator: '@evasion',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/vercel.svg',
  },
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
      <WebVitals />
    </div>
  );
}
