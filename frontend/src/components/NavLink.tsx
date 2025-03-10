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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Thêm ref để quản lý timeout

  const handleOpen = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current); // Xóa timeout cũ
    setIsOpen(true);
  };

  const handleClose = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150); // Đóng sau 200ms
  };

  if (hasDropdown) {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <div
            onPointerEnter={handleOpen} // Mở ngay lập tức
            onPointerLeave={handleClose} // Đóng sau delay
          >
            <Link
              href={href}
              className={cn(
                "px-4 py-2 text-white/70 hover:text-white transition-colors flex items-center gap-1",
                active && "text-white font-medium"
              )}
            >
              {children}
              <ChevronDown className="h-4 w-4" />
            </Link>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="bg-[#1A1F2C]/95 border-white/10 text-white w-48 dropdown-slide-down"
          onPointerEnter={handleOpen} // Giữ mở khi hover vào content
          onPointerLeave={handleClose} // Đóng sau delay khi rời content
        >
          {dropdownItems.map((item) => (
            <DropdownMenuItem
              key={item.label}
              className="hover:bg-white/5 focus:bg-white/5"
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
        "px-4 py-2 text-white/70 hover:text-white transition-colors",
        active && "text-white font-medium"
      )}
    >
      {children}
    </Link>
  );
};