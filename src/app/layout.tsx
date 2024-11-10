import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClientLayout } from "./ClientLayout";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Bosa - The Next Big Solana Memecoin | Join Now",
  description: "Join the fastest-growing Solana memecoin community. Bosa combines meme culture with real utility. Trade, earn, and connect with fellow holders.",
  keywords: "Bosa, Solana, memecoin, cryptocurrency, SOL, DeFi, trading, crypto community",
  openGraph: {
    title: "Bosa - The Next Big Solana Memecoin",
    description: "Join the fastest-growing Solana memecoin community. Trade, earn, and connect with fellow holders.",
    images: ['/assets/og-image.png'],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Bosa - The Next Big Solana Memecoin",
    description: "Join the fastest-growing Solana memecoin community. Trade, earn, and connect with fellow holders.",
    images: ['/assets/og-image.png'],
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
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://bosa.wtf" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#EC4899" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
