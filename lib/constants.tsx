import {
  CarIcon,
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
    label: "עמוד ראשי",
  },
  {
    url: "/car-search",
    icon: <CarIcon />,
    label: "איתור רכב",
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
    label: "טיפולים",
  },
  {
    url: "/customers",
    icon: <UsersRound />,
    label: "משתמשים",
  },
];
