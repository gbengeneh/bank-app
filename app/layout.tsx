import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Northgate Bank | Online Banking",
  description: "Northgate Bank demo online banking application.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
