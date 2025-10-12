import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Koopi Buyer",
  description: "Manage your orders and shop across all Koopi stores",
};

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}