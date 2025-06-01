import {
  CameraIcon,
  CarIcon,
  ClipboardSignature,
  CreditCard,
  Folder,
  Home,
  LayoutDashboard,
  ListOrdered,
  NotebookIcon,
  Shapes,
  ShoppingBag,
  ShoppingBasket,
  Tag,
  Truck,
  UsersRound,
} from "lucide-react";

export const navLinks = [
  {
    url: "/",
    icon: <Home />,
    label: "עמוד ראשי",
  },
  {
    url: "/car-search",
    icon: <CarIcon />,
    label: "איתור רכב",
  },
  {
    url: "/V2/category",
    icon: <Folder />,
    label: "קטגוריות",
  },
  {
    url: "/V2/providers",
    icon: <Truck />,
    label: "ספקים",
  },
  {
    url: "/V2/parts",
    icon: <ListOrdered />,
    label: "חלקים",
  },
  {
    url: "/V2/scan",
    icon: <CameraIcon />,
    label: "סורק",
  },
  {
    url: "/V2/cart",
    icon: <ShoppingBasket />,
    label: "עגלת קניות",
  },
    {
    url: "/V2/orders",
    icon: <ShoppingBag />,
    label: "הזמנות",
  },
  {
    url: "/V2/stock-check",
    icon: <ClipboardSignature />,
    label: "ספירת מלאי",
  },
  /*{
    url: "/reports",
    icon: <NotebookIcon />,
    label: "דוחות",
  },*/
];
