"use client";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface ChainItemProps {
  name: string;
  href: string;
  icon: LucideIcon;
  isActive: boolean;
  showName?: boolean; // Tùy chọn hiển thị tên (dùng cho tabs ngang)
}

export default function ChainItem({
  name,
  href,
  icon: Icon,
  isActive,
  showName = true,
}: ChainItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-1 transition-all duration-200 ${
        isActive
          ? "px-3 py-1 sm:px-6 sm:py-2 bg-gray-200 dark:bg-[#40324E] text-black dark:text-white hover:opacity-80"
          : "px-2 py-1 sm:px-4 sm:py-1 hover:opacity-80"
      }`}
    >
      <Icon size={25} className={`${!isActive && "text-gray-500"}`} />
      {isActive && showName && <span className="text-base">{name}</span>}
    </Link>
  );
}
