import {
  CameraIcon,
  CarIcon,
  ClipboardSignature,
  CreditCard,
  Factory,
  FileX,
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
    url: "/V2/category",
    icon: <Folder />,
    label: "קטגוריות",
  },
  {
    url: "/V2/providers",
    icon: <Factory />,
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
    url: "/V2/returns",
    icon: <FileX/>,
    label:  "החזרות",
  },
  {
    url: "/V2/notes",
    icon: <NotebookIcon />,
    label: "הערות",
  },
  
  {
    url: "/on-site",
    icon: <Truck />,
    label: "צמ\"ה",
  },
];
