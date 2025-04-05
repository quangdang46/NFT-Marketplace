import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import type { NavItem } from "@/lib/constant/menu";

interface MobileMenuProps {
  navItems: NavItem[];
}

export const MobileMenu = ({ navItems }: MobileMenuProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-white/5"
        >
          <MenuIcon className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="bg-white border-l border-gray-200 pt-12 dark:bg-[#1A1F2C] dark:border-white/10"
      >
        <SheetTitle className="visually-hidden">Menu</SheetTitle>
        <nav className="flex flex-col space-y-4">
          {navItems.map((item) => (
            <div key={item.id} className="flex flex-col">
              {/* Parent link */}
              <Link
                href={item.href}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors dark:text-white/80 dark:hover:text-white dark:hover:bg-white/5"
              >
                {item.label}
              </Link>
              {/* Dropdown items with indentation */}
              {item.hasDropdown && (
                <div className="pl-4 mt-2 space-y-2">
                  {item.dropdownItems?.map((dropItem) => (
                    <Link
                      key={dropItem.label}
                      href={dropItem.href}
                      className="block px-2 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors dark:text-white/60 dark:hover:text-white dark:hover:bg-white/5"
                    >
                      {dropItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};
