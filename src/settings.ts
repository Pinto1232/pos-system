import HomeIcon from "@mui/icons-material/Home";
import { MdProductionQuantityLimits } from "react-icons/md";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SettingsIcon from "@mui/icons-material/Settings";
import { FaChartLine } from "react-icons/fa6";
import { FaCreditCard } from "react-icons/fa6";


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
        label: "Products",
      },
      { 
        label: "Product List",
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
    icon: FaChartLine,
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
    icon: FaChartLine,
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
    icon: FaChartLine,
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
    icon: FaChartLine,
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
    icon: FaChartLine,
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
    icon: FaChartLine,
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
    icon: FaChartLine,
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
    label: "Invoices",
    icon: ReceiptIcon,
    expandable: true,
    subItems: [
      { label: "Overview" },
      { label: "Recurring Sales" },
    ],
  },
   {
    label: "System Settings",
    icon: SettingsIcon,
    expandable: true,
    subItems: [
      { 
        label: "General Settings",
       },
       { 
        label: "Business Information",
       },
       { 
        label: "Tax & VAT Configuration",
       },
       { 
        label: "Currency & Regional Settings",
       },
       {
        label: "User & Role Management"
       },
       {
        label: "Email & Notification Settings"
       },
       {
        label: "System Backup & Restore"
       },
       {
        label: "API & Third-Party Integrations",
       },
    ], 
  },
];

export const navbarLinks = [
  { label: "Inventary", href: "/" },
  { label: "Category", href: "/category" },
  { label: "Brand", href: "/brand" },
  { label: "Discount", href: "/discount" },
  { label: "Stock", href: "/stock" },
];
