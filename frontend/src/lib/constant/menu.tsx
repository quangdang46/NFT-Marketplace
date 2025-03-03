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
