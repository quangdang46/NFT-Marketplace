import {
  Bot,
  Frame,
  Map,
  PieChart,
  Settings2,
  ShoppingCart,
  ImagePlus,
  ListOrdered,
} from "lucide-react";
export const menuLists = {
  user: {
    name: "nft_user",
    email: "user@example.com",
    avatar: "/avatars/user.jpg",
  },
  navMain: [
    {
      title: "Khám phá NFT",
      url: "/explore",
      icon: Bot,
      isActive: true,
      items: [
        {
          title: "NFT mới nhất",
          url: "/explore/new",
        },
        {
          title: "Bán chạy nhất",
          url: "/explore/top",
        },
        {
          title: "Danh mục",
          url: "/explore/categories",
        },
      ],
    },
    {
      title: "Bộ sưu tập",
      url: "/collections",
      icon: ListOrdered,
      items: [
        {
          title: "Bộ sưu tập nổi bật",
          url: "/collections/featured",
        },
        {
          title: "Bộ sưu tập của tôi",
          url: "/collections/my",
        },
      ],
    },
    {
      title: "Tạo NFT",
      url: "/create",
      icon: ImagePlus,
    },
    {
      title: "Giao dịch",
      url: "/marketplace",
      icon: ShoppingCart,
      items: [
        {
          title: "Đang bán",
          url: "/marketplace/selling",
        },
        {
          title: "Đã mua",
          url: "/marketplace/purchased",
        },
        {
          title: "Yêu thích",
          url: "/marketplace/favorites",
        },
      ],
    },
    {
      title: "Tài khoản & Cài đặt",
      url: "/settings",
      icon: Settings2,
      items: [
        {
          title: "Hồ sơ",
          url: "/settings/profile",
        },
        {
          title: "Bảo mật",
          url: "/settings/security",
        },
        {
          title: "Ví & Thanh toán",
          url: "/settings/wallet",
        },
      ],
    },
  ],
  projects: [
    {
      name: "NFT Gaming",
      url: "/projects/nft-gaming",
      icon: Frame,
    },
    {
      name: "NFT Music",
      url: "/projects/nft-music",
      icon: PieChart,
    },
    {
      name: "NFT Metaverse",
      url: "/projects/nft-metaverse",
      icon: Map,
    },
  ],
};

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
    dropdownItems: [{ label: "Mint NFT", href: "/create-or-manage/mint" }],
  },
  {
    id: "explore",
    label: "Explore",
    href: "/explore",
    hasDropdown: true,
    dropdownItems: [{ label: "Chains", href: "/explore/chains" }],
  },

  {
    id: "profile",
    label: "Profile",
    href: "/profile/base/address",
    hasDropdown: false,
  },
];
