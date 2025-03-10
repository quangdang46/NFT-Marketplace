import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  if (hasDropdown) {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <a
            href={href}
            className={cn(
              "px-4 py-2 text-white/70 hover:text-white transition-colors flex items-center gap-1",
              active && "text-white font-medium"
            )}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            {children}
            <ChevronDown className="h-4 w-4" />
          </a>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="bg-[#1A1F2C]/95 border-white/10 text-white w-48 dropdown-slide-down"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {dropdownItems.map((item) => (
            <DropdownMenuItem
              key={item.label}
              className="hover:bg-white/5 focus:bg-white/5"
            >
              <a href={item.href} className="w-full py-1">
                {item.label}
              </a>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <a
      href={href}
      className={cn(
        "px-4 py-2 text-white/70 hover:text-white transition-colors",
        active && "text-white font-medium"
      )}
    >
      {children}
    </a>
  );
};
