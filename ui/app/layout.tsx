import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Content Systems Platform",
  description: "Content design platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
