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
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import ListAltIcon from '@mui/icons-material/ListAlt';
import BadgeIcon from '@mui/icons-material/Badge';
import GroupIcon from '@mui/icons-material/Group';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PaymentIcon from '@mui/icons-material/Payment';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DiscountIcon from '@mui/icons-material/Discount';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

export const sidebarItems = [
  {
    label: "Dashboard",
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
    label: "Sales",
    icon: ShoppingCartIcon,
    expandable: true,
    subItems: [
      { label: "New Sale (POS Interface)" },
      { label: "Sales History" },
      { label: "Invoices & Receipts" },
      { label: "Returns & Refunds" },
      { label: "Discounts & Promotions" },
      { label: "Loyalty & Reward Points" },
    ],
  },
  {
    label: "Orders",
    icon: ListAltIcon,
    expandable: true,
    subItems: [
      { label: "Pending Orders" },
      { label: "Completed Orders" },
      { label: "Cancelled Orders" },
      { label: "Pre-Orders" },
    ],
  },
  {
    label: "Products & Inventory",
    icon: InventoryIcon,
    expandable: true,
    subItems: [
      { label: "Product List" },
      { label: "Add/Edit Product" },
      { label: "Product Categories" },
      { label: "Stock Levels & Alerts" },
      { label: "Low Stock Warnings" },
      { label: "Bulk Import/Export" },
      { label: "Inventory Adjustments" },
      { label: "Product Expiry Tracking" },
    ],
  },
  {
    label: "Customers",
    icon: PeopleIcon,
    expandable: true,
    subItems: [
      { label: "Customer List" },
      { label: "Add/Edit Customer" },
      { label: "Customer Groups" },
      { label: "Customer Purchase History" },
      { label: "Loyalty Program" },
      { label: "Customer Feedback & Reviews" },
      { label: "Debt & Credit Management" },
    ],
  },
  {
    label: "Suppliers & Purchases",
    icon: LocalShippingIcon,
    expandable: true,
    subItems: [
      { label: "Supplier List" },
      { label: "Add/Edit Supplier" },
      { label: "Purchase Orders" },
      { label: "Pending Deliveries" },
      { label: "Stock Replenishment Requests" },
      { label: "Supplier Payments & Invoices" },
    ],
  },
  {
    label: "Employees & Cashiers",
    icon: BadgeIcon,
    expandable: true,
    subItems: [
      { label: "Employee List" },
      { label: "Roles & Permissions" },
      { label: "Cashier Sessions" },
      { label: "Shift Management" },
      { label: "Attendance Tracking" },
      { label: "Activity Logs" },
    ],
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
    label: "Reports & Analytics",
    icon: AssessmentIcon,
    expandable: true,
    subItems: [
      { label: "Sales Reports" },
      { label: "Top-Selling Products Report" },
      { label: "Profit & Loss Report" },
      { label: "Stock Movement Report" },
      { label: "Employee Performance Report" },
      { label: "Customer Purchase Trends" },
      { label: "Tax & Compliance Reports" },
      { label: "Payment Method Breakdown" },
    ],
  },
  {
    label: "Payments",
    icon: PaymentIcon,
    expandable: true,
    subItems: [
      { label: "Accepted Payment Methods" },
      { label: "Transaction History" },
      { label: "Pending Payments" },
      { label: "Refund Processing" },
      { label: "Cash Management" },
    ],
  },
  {
    label: "Expenses & Accounting",
    icon: AccountBalanceIcon,
    expandable: true,
    subItems: [
      { label: "Expense Tracking" },
      { label: "Recurring Expenses" },
      { label: "Cash Flow Overview" },
      { label: "Supplier Payments" },
      { label: "Tax Calculations" },
    ],
  },
  {
    label: "Promotions & Discounts",
    icon: DiscountIcon,
    expandable: true,
    subItems: [
      { label: "Create New Discount" },
      { label: "Active Promotions" },
      { label: "Coupon & Voucher Management" },
      { label: "Seasonal & Flash Sales" },
    ],
  },
  {
    label: "Online Orders",
    icon: ShoppingBagIcon,
    expandable: true,
    subItems: [
      { label: "E-commerce Orders" },
      { label: "Order Fulfillment Status" },
      { label: "Delivery Management" },
      { label: "Customer Complaints & Disputes" },
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
