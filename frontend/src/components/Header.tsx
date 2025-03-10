"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { navItems } from "@/lib/constant/menu";
import { MobileMenu } from "@/components/MobileMenu";
import { SearchBar } from "@/components/SearchBar";
import { NavLink } from "@/components/NavLink";
import { WalletButton } from "@/components/WalletButton";
import { ModeToggle } from "@/components/ui/darkmode";

export function Header() {
  const [activeTab] = useState("collections");
  const isMobile = useIsMobile();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1A1F2C]/95 backdrop-blur-sm border-b border-white/5 py-3">
      <div className="flex items-center justify-between px-2 sm:px-4">
        {/* Logo */}
        <div className="flex items-center">
          <span className="text-xl font-bold text-white mr-2">
            <span className="text-[#ec4899]">M</span>
            <span className="text-[#9948ec]">E</span>
          </span>
          <span className="hidden md:block text-sm font-medium text-white">
            MAGIC EDEN
          </span>
        </div>

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
            <NavLink href="/wallet" active={activeTab === "wallet"}>
              <span className="text-[#ec4899] font-medium">Wallet</span>
            </NavLink>
          </nav>
        )}

        {/* Search Bar */}
        <SearchBar isMobile={isMobile} />

        {/* Wallet & Earn Buttons */}
        <div className="flex items-center space-x-2 ml-auto">
          <Button
            variant="ghost"
            className="hidden md:flex items-center text-[#ec4899] hover:text-[#ec4899]/80 hover:bg-white/5"
          >
            Earn
          </Button>

          <WalletButton />
          <ModeToggle></ModeToggle>

          {/* Mobile Menu */}
          {isMobile && <MobileMenu navItems={navItems} />}
        </div>
      </div>
    </header>
  );
}
