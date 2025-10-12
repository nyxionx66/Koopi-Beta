"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, ShoppingCart, Package, Users, BarChart, Settings, LogOut, ChevronDown, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useState, useRef, useEffect } from "react";

const navLinks = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/website", label: "Website", icon: Globe },
  { href: "/dashboard/customers", label: "Customers", icon: Users },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart },
];

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to log out. Please try again.');
    }
  };

  const getUserInitial = () => {
    if (!user) return 'U';
    if (user.displayName) return user.displayName.charAt(0).toUpperCase();
    if (user.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  const getUserName = () => {
    if (!user) return 'User';
    return user.displayName || user.email?.split('@')[0] || 'User';
  };

  const getUserEmail = () => {
    if (!user || !user.email) return '';
    return user.email;
  };

  return (
    <aside className="w-56 h-screen bg-[#f1f1f1] text-gray-800 flex flex-col">
      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-0.5">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.label}
              href={link.href}
              className={`flex items-center px-3 py-2 text-[13px] font-medium rounded-lg transition-colors ${
                isActive
                  ? "bg-white text-gray-900"
                  : "text-gray-700 hover:bg-gray-200/50"
              }`}
            >
              <link.icon className="w-[18px] h-[18px] mr-3" strokeWidth={2} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="px-3 pb-3">
        <Link
          href="/dashboard/settings"
          className={`flex items-center px-3 py-2 text-[13px] font-medium rounded-lg transition-colors ${
            pathname === '/dashboard/settings'
              ? "bg-white text-gray-900"
              : "text-gray-700 hover:bg-gray-200/50"
          }`}
        >
          <Settings className="w-[18px] h-[18px] mr-3" strokeWidth={2} />
          Settings
        </Link>
      </div>

      {/* User Profile Section at Bottom */}
      <div className="p-3 border-t border-gray-300">
        <div className="relative" ref={dropdownRef}>
          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
              {/* User Info Header */}
              <div className="px-3 py-2.5 border-b border-gray-200 bg-gray-50">
                <p className="text-[13px] font-medium text-gray-900 truncate">
                  {getUserName()}
                </p>
                <p className="text-[11px] text-gray-500 truncate mt-0.5">
                  {getUserEmail()}
                </p>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors text-left"
              >
                <LogOut className="w-[15px] h-[15px]" strokeWidth={2} />
                <span>Log out</span>
              </button>
            </div>
          )}

          {/* Profile Button */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors ${
              isDropdownOpen ? 'bg-gray-200/70' : 'hover:bg-gray-200/50'
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center text-white font-medium text-[11px] flex-shrink-0">
              {getUserInitial()}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[13px] font-medium text-gray-900 truncate">
                {getUserName()}
              </p>
            </div>
            <ChevronDown 
              className={`w-4 h-4 text-gray-500 flex-shrink-0 transition-transform ${
                isDropdownOpen ? 'rotate-180' : ''
              }`} 
            />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;