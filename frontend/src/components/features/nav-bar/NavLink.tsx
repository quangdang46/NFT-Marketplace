"use client";

import type React from "react";

import { ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  hasDropdown?: boolean;
  dropdownItems?: { label: string; href: string }[];
}

export const NavLink = ({
  href,
  children,
  active = false,
  hasDropdown = false,
  dropdownItems = [],
}: NavLinkProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleOpen = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleClose = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  if (hasDropdown) {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <div onPointerEnter={handleOpen} onPointerLeave={handleClose}>
            <Link
              href={href}
              className={cn(
                "px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1",
                "dark:text-white/70 dark:hover:text-white",
                active &&
                  "text-gray-900 font-medium dark:text-white dark:font-medium"
              )}
            >
              {children}
              <ChevronDown className="h-4 w-4" />
            </Link>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="bg-white border border-gray-200 text-gray-900 w-48 dropdown-slide-down z-[100] dark:bg-[#1A1F2C] dark:border-white/10 dark:text-white"
          onPointerEnter={handleOpen}
          onPointerLeave={handleClose}
        >
          {dropdownItems.map((item) => (
            <DropdownMenuItem
              key={item.label}
              className="hover:bg-gray-50 focus:bg-gray-50 dark:hover:bg-white/5 dark:focus:bg-white/5"
            >
              <Link href={item.href} className="w-full py-1">
                {item.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors",
        "dark:text-white/70 dark:hover:text-white",
        active && "text-gray-900 font-medium dark:text-white dark:font-medium"
      )}
    >
      {children}
    </Link>
  );
};
