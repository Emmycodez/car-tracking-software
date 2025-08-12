import type { Metadata } from "next";
import { Rethink_Sans } from "next/font/google";
import "./globals.css";
import { SessionProvider } from 'next-auth/react';
import { Toaster } from "react-hot-toast";


const inter = Rethink_Sans({ subsets: ["latin"], display: "swap" });


export const metadata: Metadata = {
  title: "TrackerApp",
  description: "Gain real-time insights into the whereabouts of your vehicles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster/>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
