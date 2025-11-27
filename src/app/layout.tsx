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
  title: "Evasion",
  description: "Book leisure, hotel stays & travel in a few clicks. Hotels, activities & getaways across France. Évasion, your expert in well-being and discovery.",
};

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
