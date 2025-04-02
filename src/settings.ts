import HomeIcon from "@mui/icons-material/Home";
import { MdProductionQuantityLimits } from "react-icons/md";
import { RiCustomerService2Fill } from "react-icons/ri";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SettingsIcon from "@mui/icons-material/Settings";
import { FaCreditCard, FaUsers, FaChartLine, FaMoneyBillWave, FaPercent } from "react-icons/fa";
import { TbReorder, TbTruckDelivery } from "react-icons/tb";
import { BiReceipt } from "react-icons/bi";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ListAltIcon from "@mui/icons-material/ListAlt";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import BadgeIcon from "@mui/icons-material/Badge";

export const sidebarItems = [
  {
    label: "Dashboard",
    icon: HomeIcon,
  },
  {
    label: "Products & Inventory",
    icon: MdProductionQuantityLimits ,
    expandable: true,
    subItems: [
      { 
        label: "Products List",
      },
       { 
        label: "Add/Edit Product",
       },
       { 
        label: "Product Categories",
       },
       {
        label: "Stock Levels & Alerts",
       },
       {
        label: "Low Stock Warnings",
       },
       {
        label: "Bulk Import/Export",
       },
       {
        label: "Inventory Adjustments",
       },
       {
        label: "Product Expiry Tracking"
       }
    ],
  },
  {
    label: "Sales",
    icon: FaCreditCard,
    expandable: true,
    subItems: [
      { 
        label: "New Sales",
       },
       { 
        label: "Sales History",
       },
       { 
        label: "Invoices & Receipts",
       },
       { 
        label: "Returns & Refunds",
       },
       { 
        label: "Discounts & Promotions",
       },
       {
        label: "Loyalty & Reward Points"
       },
       
    ], 
  },
  {
    label: "Orders",
    icon: TbReorder ,
    expandable: true,
    subItems: [
      { 
        label: "Pending Orders",
       },
       { 
        label: "Completed Orders",
       },
       { 
        label: "Cancelled Orders",
       },
       { 
        label: "Pre-Orders",
       },
    ], 
  },
  {
    label: "Customers",
    icon: RiCustomerService2Fill ,
    expandable: true,
    subItems: [
      { 
        label: "Customer List",
       },
       { 
        label: "Add/Edit Customer",
       },
       { 
        label: "Customer Groups",
       },
       { 
        label: "Customer Purchase History",
       },
       {
        label: "Loyalty Program"
       },
       {
        label: "Customer Feedback & Reviews"
       },
       {
        label: "Debt & Credit Management"
       },
    ], 
  },

  {
    label: "Suppliers & Purchases",
    icon: TbTruckDelivery,
    expandable: true,
    subItems: [
      { 
        label: "Supplier List",
       },
       { 
        label: "Add/Edit Supplier",
       },
       { 
        label: "Purchase Orders",
       },
       { 
        label: "Pending Deliveries",
       },
       {
        label: "Stock Replenishment Requests"
       },
       {
        label: "Supplier Payments & Invoices"
       },
    ], 
  },
  {
    label: "Employees & Cashiers",
    icon: FaUsers,
    expandable: true,
    subItems: [
      { 
        label: "Employee List",
       },
       { 
        label: "Roles & Permissions",
       },
       { 
        label: "Cashier Sessions",
       },
       { 
        label: "Shift Management",
       },
       {
        label: "Attendance Tracking"
       },
       {
        label: "Activity Logs"
       },
    ], 
  },
  {
    label: "Reports & Analytics",
    icon: FaChartLine,
    expandable: true,
    subItems: [
      { 
        label: "Sales Reports",
       },
       { 
        label: "Top-Selling Products Report",
       },
       { 
        label: "Profit & Loss Report",
       },
       { 
        label: "Stock Movement Report",
       },
       {
        label: "Employee Performance Report"
       },
       {
        label: "Customer Purchase Trends Report"
       },
       {
        label: "Tax & Compliance Reports"
       },
       {
        label: "Payment Method Breakdown"
       },
    ], 
  },
  {
    label: "Payments",
    icon: FaMoneyBillWave,
    expandable: true,
    subItems: [
      { 
        label: "Accepted Payment Methods ",
       },
       { 
        label: "Transaction History",
       },
       { 
        label: "Pending Payments",
       },
       { 
        label: "Refund Processing",
       },
       {
        label: "Cash Managementt"
       },
       {
        label: "Customer Purchase Trends Report"
       },
    ], 
  },
  {
    label: "Expenses & Accounting",
    icon: BiReceipt,
    expandable: true,
    subItems: [
      { 
        label: "Expense Tracking",
       },
       { 
        label: "Recurring Expenses",
       },
       { 
        label: "Cash Flow Overview",
       },
       { 
        label: "Supplier Payments",
       },
       {
        label: "Cash Managementt",
       },
       {
        label: "Tax Calculations"
       },
    ], 
  },
  {
    label: "Promotions & Discounts",
    icon: FaPercent,
    expandable: true,
    subItems: [
      { 
        label: "Create New Discount",
       },
       { 
        label: "Active Promotions",
       },
       { 
        label: "Coupon & Voucher Management",
       },
       { 
        label: "Seasonal & Flash Sales",
       },
    ], 
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
    label: "Settings",
    icon: SettingsIcon,
    expandable: false,
  },
];

export const navbarLinks = [
  { label: "Inventary", href: "/" },
  { label: "Category", href: "/category" },
  { label: "Brand", href: "/brand" },
  { label: "Discount", href: "/discount" },
  { label: "Stock", href: "/stock" },
];
