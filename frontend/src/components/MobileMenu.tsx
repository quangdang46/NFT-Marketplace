import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";

interface NavItem {
  id: string;
  label: string;
  href: string;
  hasDropdown: boolean;
  dropdownItems?: { label: string; href: string }[];
}

interface MobileMenuProps {
  navItems: NavItem[];
}

export const MobileMenu = ({ navItems }: MobileMenuProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <MenuIcon className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="bg-[#1A1F2C]/95 border-white/10 pt-12"
      >
        <SheetTitle className="visually-hidden">Menu</SheetTitle>
        <nav className="flex flex-col space-y-4">
          {navItems.map((item) => (
            <div key={item.id} className="flex flex-col">
              {/* Parent link */}
              <Link
                href={item.href}
                className="px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded-md transition-colors"
              >
                {item.label}
              </Link>
              {/* Dropdown items với lùi vào */}
              {item.hasDropdown && (
                <div className="pl-4 mt-2 space-y-2">
                  {item.dropdownItems?.map((dropItem) => (
                    <Link
                      key={dropItem.label}
                      href={dropItem.href}
                      className="block px-2 py-1 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-md transition-colors"
                    >
                      {dropItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link
            href="/wallet"
            className="px-4 py-2 text-[#f97316] font-medium hover:bg-white/5 rounded-md transition-colors"
          >
            Wallet
          </Link>
          <Button
            variant="ghost"
            className="justify-start text-[#ec4899] hover:text-[#ec4899]/80 hover:bg-white/5"
          >
            Earn
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
};
