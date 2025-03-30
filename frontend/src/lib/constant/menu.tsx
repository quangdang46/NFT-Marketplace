// export interface NavItem {
//   id: string;
//   label: string;
//   href: string;
//   hasDropdown: boolean;
//   dropdownItems?: { label: string; href: string }[];

// }

// export const navItems: NavItem[] = [
//   {
//     id: "collections",
//     label: "Collections",
//     href: "/collections",
//     hasDropdown: true,
//     dropdownItems: [
//       { label: "Chains", href: "/collections/chain/ethereum" },
//       { label: "Address", href: "/collections/collection-1" },
//     ],
//   },

//   {
//     id: "Create",
//     label: "Create",
//     href: "/create",
//     hasDropdown: false,
//     dropdownItems: [],
//   },
//   {
//     id: "profile",
//     label: "Profile",
//     href: "/profile",
//     hasDropdown: true,
//     dropdownItems: [
//       { label: "Me", href: "/profile/me" },
//       { label: "Address", href: "/profile/address/xxxxxxxx" },
//       { label: "Settings", href: "/profile/settings" },
//       { label: "Activity", href: "/profile/user-1/activity" },
//       { label: "collections", href: "/profile/user-1/collections" },
//       { label: "favorites", href: "/profile/user-1/favorites" },
//       { label: "nfts", href: "/profile/user-1/nfts" },
//     ],
//   },

//   {
//     id: "Auctions",
//     label: "Auctions",
//     href: "/auctions",
//     hasDropdown: true,
//     dropdownItems: [{ label: "Details auction", href: "/auctions/auction-1" }],
//   },

//   {
//     id: "NFTS",
//     label: "NFTS",
//     href: "/nfts/nft-1",
//     hasDropdown: true,
//     dropdownItems: [{ label: "Shop nft", href: "/nfts/nft-1/listnft" }],
//   },

//   {
//     id: "wallets",
//     label: "Wallets",
//     href: "/wallets",
//     hasDropdown: false,
//     dropdownItems: [],
//   },
// ];


export interface NavItem {
  id: string;
  label: string;
  href: string;
  hasDropdown: boolean;
  dropdownItems?: { label: string; href: string }[];
  requiresAuth?: boolean; // Add this property to indicate if the item requires authentication
}

// Items that are always visible regardless of authentication status
export const publicNavItems: NavItem[] = [
  {
    id: "collections",
    label: "Collections",
    href: "/collections",
    hasDropdown: true,
    dropdownItems: [
      { label: "Chains", href: "/collections/chain/ethereum" },
      { label: "Address", href: "/collections/collection-1" },
    ],
  },
  {
    id: "Auctions",
    label: "Auctions",
    href: "/auctions",
    hasDropdown: true,
    dropdownItems: [{ label: "Details auction", href: "/auctions/auction-1" }],
  },
  {
    id: "NFTS",
    label: "NFTS",
    href: "/nfts/nft-1",
    hasDropdown: true,
    dropdownItems: [{ label: "Shop nft", href: "/nfts/nft-1/listnft" }],
  },
  {
    id: "wallets",
    label: "Wallets",
    href: "/wallets",
    hasDropdown: false,
    dropdownItems: [],
  },
];

// Items that are only visible when authenticated
export const authNavItems: NavItem[] = [
  {
    id: "Create",
    label: "Create",
    href: "/create",
    hasDropdown: false,
    dropdownItems: [],
    requiresAuth: true,
  },
  {
    id: "profile",
    label: "Profile",
    href: "/profile",
    hasDropdown: true,
    requiresAuth: true,
    dropdownItems: [
      { label: "Me", href: "/profile/me" },
      { label: "Address", href: "/profile/address/xxxxxxxx" },
      { label: "Settings", href: "/profile/settings" },
      { label: "Activity", href: "/profile/user-1/activity" },
      { label: "collections", href: "/profile/user-1/collections" },
      { label: "favorites", href: "/profile/user-1/favorites" },
      { label: "nfts", href: "/profile/user-1/nfts" },
    ],
  },
];

// Helper function to get the appropriate nav items based on authentication status
export const getNavItems = (isAuthenticated: boolean): NavItem[] => {
  if (isAuthenticated) {
    return [...publicNavItems, ...authNavItems];
  }
  return publicNavItems;
};
