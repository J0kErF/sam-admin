import {
  CameraIcon,
  CarIcon,
  LayoutDashboard,
  NotebookIcon,
  Shapes,
  ShoppingBag,
  Tag,
  UsersRound,
} from "lucide-react";

export const navLinks = [
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
    url: "/scan",
    icon: <CameraIcon />,
    label: "סורק",
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
  {
    url: "/",
    icon: <NotebookIcon />,
    label: "דוחות",
  },
];
