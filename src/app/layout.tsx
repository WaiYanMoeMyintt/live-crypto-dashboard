import type { Metadata } from "next";
import { Open_Sans, Nunito_Sans } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CoinEdge | Crypto Live Trading Dashboard",
  description: "Professional real-time crypto analytics, trading statistics, and market overview dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${openSans.variable} ${nunitoSans.variable} dark`}>
      <body className="min-h-screen bg-[#08090b] text-white font-sans antialiased selection:bg-[#d4f434] selection:text-black">
        {children}
      </body>
    </html>
  );
}


