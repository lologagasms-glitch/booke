import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { ProvidersQiery } from "@/components/query/providerQuery";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import 'leaflet/dist/leaflet.css';
import './styles/themes.css';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    images: '/images/og-image.png', // chemin relatif, sera résolu via metadataBase
  },
  twitter: {
    images: '/images/og-image.png',
  },
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ProvidersQiery>
          <ThemeProvider>
            <NextIntlClientProvider>
              {children}
            </NextIntlClientProvider>
          </ThemeProvider>
        </ProvidersQiery>
      </body>
    </html>
  );
}
