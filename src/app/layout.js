'use client';
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from 'next-auth/react';

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "Brooklyn Museum LLM Generate",
//   description: "Brooklyn Museum Generating Information from Artwork with LLMs",
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <SessionProvider refetchOnWindowFocus={false}>
      <body className={inter.className}>{children}</body>
      </SessionProvider>
    </html>
  );
}
