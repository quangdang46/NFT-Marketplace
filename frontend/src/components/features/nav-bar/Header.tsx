"use client";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { getNavItems } from "@/lib/constant/menu";
import { MobileMenu } from "@/components/features/nav-bar/MobileMenu";
import { SearchBar } from "@/components/features/nav-bar/SearchBar";
import { NavLink } from "@/components/features/nav-bar/NavLink";

import { ModeToggle } from "@/components/ui/darkmode";
import Link from "next/link";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { WalletSection } from "@/components/features/wallet-button/WalletSection";

export function Header() {
  const [activeTab] = useState("collections");
  const isMobile = useIsMobile();
  // Get authentication status from Redux
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Get the appropriate nav items based on authentication status
  const navItems = getNavItems(isAuthenticated);
  return (
    <header className="bg-white border-b border-gray-200 py-3 dark:bg-[#1A1F2C] dark:border-white/5 transition-colors">
      <div className="flex items-center justify-between px-2 sm:px-4 mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold text-gray-900 mr-2 dark:text-white">
            <span className="text-[#ec4899]">M</span>
            <span className="text-[#9948ec]">E</span>
          </span>
          <span className="hidden md:block text-sm font-medium text-gray-900 dark:text-white">
            MAGIC EDEN
          </span>
        </Link>

        {/* Desktop Nav Links */}
        {!isMobile && (
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                href={item.href}
                active={activeTab === item.id}
                hasDropdown={item.hasDropdown}
                dropdownItems={item.dropdownItems}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}

        {/* Search Bar */}
        <SearchBar isMobile={isMobile} />

        {/* Wallet & Earn Buttons */}
        <div className="flex items-center space-x-2 ml-auto">
          <WalletSection></WalletSection>
          <ModeToggle></ModeToggle>
          {/* Mobile Menu */}
          {isMobile && <MobileMenu navItems={navItems} />}
        </div>
      </div>
    </header>
  );
}
