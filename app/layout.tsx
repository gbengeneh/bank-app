import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Regions Bank | Online Banking",
  description: "Regions Bank  online banking application.",
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
