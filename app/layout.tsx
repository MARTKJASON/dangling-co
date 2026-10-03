import type { Metadata } from "next";
import { Figtree, Fraunces } from "next/font/google";
import "./globals.css";
import { BasketPanel } from "./components/basket/BasketPanel";
import { Toaster } from "./components/ui/Toaster";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
  weight: "variable",
});

export const metadata: Metadata = {
  title: "Dangling Co. - Custom Beaded Jewelry",
  description: "Custom beaded jewelry made with love and care",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${figtree.variable} ${fraunces.variable}`}>
      <body className="antialiased">
        {children}
        <BasketPanel />
        <Toaster />
      </body>
    </html>
  );
}
