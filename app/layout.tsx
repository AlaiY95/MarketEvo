// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from './components/SessionProvider'
import GoogleAnalytics from './components/GoogleAnalytics'
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MarketEvo - AI-Powered Trading Analysis",
  description: "Transform your trading charts into profitable insights with cutting-edge AI technology. Get precise entry points, risk management, and price targets in seconds.",
  keywords: ["trading", "chart analysis", "AI", "technical analysis", "forex", "stocks", "crypto", "swing trading", "scalp trading", "risk management"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}