export interface NavItem {
  id: string;
  label: string;
  href: string;
  hasDropdown: boolean;
  dropdownItems?: { label: string; href: string }[];
}

export const navItems: NavItem[] = [
  {
    id: "collections",
    label: "Collections",
    href: "/collections",
    hasDropdown: true,
    dropdownItems: [
      { label: "Chains", href: "/collections/chains" },
      { label: "Address", href: "/collections/chains/address" },
    ],
  },
  {
    id: "account",
    label: "Account",
    href: "/account",
    hasDropdown: false,
  },
  {
    id: "mint",
    label: "Mint",
    href: "/create-or-manage",
    hasDropdown: true,
    dropdownItems: [
      { label: "Create collection", href: "/create-or-manage/create" },
    ],
  },
  {
    id: "profile",
    label: "Profile",
    href: "/profile/base/address",
    hasDropdown: false,
    dropdownItems: [],
  },
  {
    id: "launchpad",
    label: "Launchpad",
    href: "/launchpad/chains/address",
    hasDropdown: false,
    dropdownItems: [],
  },
];
