import HomeIcon from "@mui/icons-material/Home";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CategoryIcon from "@mui/icons-material/Category";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SettingsIcon from "@mui/icons-material/Settings";

export const sidebarItems = [
  {
    label: "dashboard",
    icon: HomeIcon,
  },
  {
    label: "Inventory",
    icon: InventoryIcon,
    expandable: true,
    subItems: [
      { label: "Products" },
    ],
  },
  {
    label: "Product Sold",
    icon: ShoppingCartIcon,
  },
  {
    label: "Dairy & Eggs",
    icon: LocalDrinkIcon,
  },
  {
    label: "Beverages",
    icon: FastfoodIcon,
  },
  {
    label: "Cookies & Snacks",
    icon: CategoryIcon,
  },
  {
    label: "Clean & Hygiene",
    icon: CleaningServicesIcon,
  },
  {
    label: "Miscellaneous",
    icon: MiscellaneousServicesIcon,
  },
  {
    label: "Invoices",
    icon: ReceiptIcon,
    expandable: true,
    subItems: [
      { label: "Overview" },
      { label: "Recurring Sales" },
    ],
  },
  {
    label: "Settings",
    icon: SettingsIcon,
  },
];

export const navbarLinks = [
  { label: "Inventary", href: "/" },
  { label: "Category", href: "/category" },
  { label: "Brand", href: "/brand" },
  { label: "Discount", href: "/discount" },
  { label: "Stock", href: "/stock" },
];
