"use client";

import { ThemeProvider } from "@/contexts/ThemeContext";

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeProvider>{children}</ThemeProvider>;
}