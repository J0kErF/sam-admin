import {
  LayoutDashboard,
  Shapes,
  ShoppingBag,
  Tag,
  UsersRound,
} from "lucide-react";

export const navLinks = [
  {
    url: "/",
    icon: <LayoutDashboard />,
    label: "דשבורד",
  },
  {
    url: "/collections",
    icon: <Shapes />,
    label: "קולקציות",
  },
  {
    url: "/products",
    icon: <Tag />,
    label: "מוצרים",
  },
  {
    url: "/orders",
    icon: <ShoppingBag />,
    label: "קניות",
  },
  {
    url: "/customers",
    icon: <UsersRound />,
    label: "משתמשים",
  },
];
