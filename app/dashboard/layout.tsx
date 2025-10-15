"use client";

import Sidebar from "@/components/Sidebar";
import { useState } from "react";
import { Menu } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen md:flex bg-gray-100 text-neutral-800">
      {/* Mobile Menu Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-10 bg-black opacity-50 md:hidden"
        ></div>
      )}

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 md:ml-64">
        {/* Hamburger menu button for mobile */}
        <div className="md:hidden flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {children}
      </main>
    </div>
  );
}