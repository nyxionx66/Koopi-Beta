"use client";

import { useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import NextLink from "next/link";
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <header className="fixed top-0 w-full bg-black backdrop-blur-md z-50 border-b border-gray-800">
      <nav className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center">
            <NextLink href="/" className="text-xl font-semibold text-white">
              Koopi
            </NextLink>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {isHomePage && (
              <>
                <ScrollLink to="features" smooth={true} duration={500} spy={true} offset={-50} className="cursor-pointer text-sm font-medium text-gray-300 hover:text-white transition-colors">
                  Features
                </ScrollLink>
                <ScrollLink to="about" smooth={true} duration={500} spy={true} offset={-50} className="cursor-pointer text-sm font-medium text-gray-300 hover:text-white transition-colors">
                  About
                </ScrollLink>
              </>
            )}
            {user ? (
              <NextLink href="/dashboard" className="px-4 py-1.5 text-sm font-medium text-black bg-white rounded-md hover:bg-gray-200 transition-colors">
                Dashboard
              </NextLink>
            ) : (
              <>
                <NextLink href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                  Log in
                </NextLink>
                <NextLink
                  href="/signup"
                  className="px-4 py-1.5 text-sm font-medium text-black bg-white rounded-md hover:bg-gray-200 transition-colors"
                >
                  Start Free
                </NextLink>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3 bg-black border border-gray-800 rounded-lg mt-2 px-4">
            {isHomePage && (
              <>
                <ScrollLink to="features" smooth={true} duration={500} spy={true} offset={-50} className="cursor-pointer block text-sm font-medium text-gray-300 hover:text-white">
                  Features
                </ScrollLink>
                <ScrollLink to="about" smooth={true} duration={500} spy={true} offset={-50} className="cursor-pointer block text-sm font-medium text-gray-300 hover:text-white">
                  About
                </ScrollLink>
              </>
            )}
            {user ? (
              <NextLink href="/dashboard" className="block w-full px-4 py-2 text-sm font-medium text-center text-black bg-white rounded-md hover:bg-gray-200">
                Dashboard
              </NextLink>
            ) : (
              <>
                <NextLink href="/login" className="block text-sm font-medium text-gray-300 hover:text-white">
                  Log in
                </NextLink>
                <NextLink
                  href="/signup"
                  className="block w-full px-4 py-2 text-sm font-medium text-center text-black bg-white rounded-md hover:bg-gray-200"
                >
                  Start Free
                </NextLink>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
