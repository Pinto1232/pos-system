import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import BrandIcon from "@mui/icons-material/BrandingWatermark";
import ProductsIcon from "@mui/icons-material/ShoppingCart";
import ReportsIcon from "@mui/icons-material/Assessment";
import { HomeRepairServiceTwoTone } from "@mui/icons-material";

export const navItems = [
  { 
    label: "Home",
    icon: HomeRepairServiceTwoTone, 
  },
  { 
    label: "Inventory",
    icon: InventoryIcon 
  },
  { 
    label: "Category",
    icon: CategoryIcon,
    subLinks: [
      { label: "Sub-item 1" },
      { label: "Sub-item 2" }
    ]
  },
  { 
    label: "Brand",
    icon: BrandIcon 
  },
  { 
    label: "Products",
    icon: ProductsIcon 
  },
  { 
    label: "Reports",
    icon: ReportsIcon 
  },
];
