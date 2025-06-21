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
  description: "Transform your trading charts into profitable insights with cutting-edge AI technology.",
  icons: {
    icon: [
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },  // High quality!
      { url: '/site-icon.ico'}  // Fallback for older browsers
    ],
    shortcut: '/site-icon.ico',
    apple: '/apple-touch-icon.png'
  }
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
         <link rel="icon" type="image/svg+xml" href="/logo.svg" />
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="shortcut icon" href="/site-icon.ico" />
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