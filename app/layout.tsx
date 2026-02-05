import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from '../components/providers';
import BanCheckWrapper from '../components/BanCheckWrapper';
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
  title: "Luno Dashboard",
  description: "Discord Bot Dashboard",
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
        <Providers>
          <BanCheckWrapper>
            {children}
          </BanCheckWrapper>
        </Providers>
      </body>
    </html>
  );
}
