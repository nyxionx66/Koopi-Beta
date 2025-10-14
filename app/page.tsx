import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { Pricing } from "@/components/Pricing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Koopi - Build Your Online Store in Minutes",
  description: "Create a beautiful, fully-functional online store with Koopi. No coding required. Start selling today!",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Header />
      <Hero />
      <Features />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}
