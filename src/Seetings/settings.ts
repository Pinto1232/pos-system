import HomeIcon from '@mui/icons-material/Home';
import { MdProductionQuantityLimits, MdAttachMoney } from 'react-icons/md';
import { RiCustomerService2Fill } from 'react-icons/ri';
import SettingsIcon from '@mui/icons-material/Settings';
import { BsMegaphone } from 'react-icons/bs';
import {
  FaCreditCard,
  FaUsers,
  FaChartLine,
  FaMoneyBillWave,
} from 'react-icons/fa';
import { TbReorder, TbTruckDelivery } from 'react-icons/tb';
import { BiReceipt } from 'react-icons/bi';
import { ElementType } from 'react';

export interface SidebarItem {
  label: string;
  icon: ElementType;
  expandable?: boolean;
  requiredPackage?: {
    minPrice: number;
    name: string;
    excludeFromPremiumPlus?: boolean;
  };
  subItems?: Array<{
    label: string;
    requiredPackage?: {
      minPrice: number;
      name: string;
      excludeFromPremiumPlus?: boolean;
    };
  }>;
}

export const sidebarItems: SidebarItem[] = [
  {
    label: 'Dashboard',
    icon: HomeIcon,
  },
  {
    label: 'Pricing Packages',
    icon: MdAttachMoney,
  },
  {
    label: 'Products & Inventory',
    icon: MdProductionQuantityLimits,
    expandable: true,
    requiredPackage: {
      minPrice: 149.99,
      name: 'Premium Plus',
    },
    subItems: [
      {
        label: 'Products List',
      },
      {
        label: 'Add/Edit Product',
      },
      {
        label: 'Product Categories',
      },
      {
        label: 'Stock Levels & Alerts',
        requiredPackage: {
          minPrice: 149.99,
          name: 'Premium Plus',
        },
      },
      {
        label: 'Low Stock Warnings',
        requiredPackage: {
          minPrice: 149.99,
          name: 'Premium Plus',
        },
      },
      {
        label: 'Bulk Import/Export',
        requiredPackage: {
          minPrice: 149.99,
          name: 'Premium Plus',
        },
      },
      {
        label: 'Inventory Adjustments',
      },
      {
        label: 'Product Expiry Tracking',
        requiredPackage: {
          minPrice: 149.99,
          name: 'Premium Plus',
        },
      },
    ],
  },
  {
    label: 'Sales',
    icon: FaCreditCard,
    expandable: true,
    requiredPackage: {
      minPrice: 29.99,
      name: 'Basic',
    },
    subItems: [
      {
        label: 'New Sale',
      },
      {
        label: 'Sales History',
      },
      {
        label: 'Invoices & Receipts',
      },
      {
        label: 'Returns & Refunds',
        requiredPackage: {
          minPrice: 49.99,
          name: 'Professional',
        },
      },
      {
        label: 'Discounts & Promotions',
        requiredPackage: {
          minPrice: 49.99,
          name: 'Professional',
        },
      },
      {
        label: 'Loyalty & Reward Points',
        requiredPackage: {
          minPrice: 99.99,
          name: 'Enterprise',
        },
      },
    ],
  },
  {
    label: 'Orders',
    icon: TbReorder,
    expandable: true,
    requiredPackage: {
      minPrice: 29.99,
      name: 'Basic',
    },
    subItems: [
      {
        label: 'Pending Orders',
      },
      {
        label: 'Completed Orders',
      },
      {
        label: 'Cancelled Orders',
      },
      {
        label: 'Pre-Orders',
        requiredPackage: {
          minPrice: 49.99,
          name: 'Professional',
        },
      },
    ],
  },
  {
    label: 'Customers',
    icon: RiCustomerService2Fill,
    expandable: true,
    requiredPackage: {
      minPrice: 29.99,
      name: 'Basic',
    },
    subItems: [
      {
        label: 'Customer List',
      },
      {
        label: 'Add/Edit Customer',
      },
      {
        label: 'Customer Groups',
        requiredPackage: {
          minPrice: 49.99,
          name: 'Professional',
        },
      },
      {
        label: 'Customer Purchase History',
      },
      {
        label: 'Loyalty Program',
        requiredPackage: {
          minPrice: 99.99,
          name: 'Enterprise',
        },
      },
      {
        label: 'Customer Feedback & Reviews',
        requiredPackage: {
          minPrice: 49.99,
          name: 'Professional',
        },
      },
      {
        label: 'Debt & Credit Management',
        requiredPackage: {
          minPrice: 99.99,
          name: 'Enterprise',
        },
      },
    ],
  },
  {
    label: 'Suppliers & Purchases',
    icon: TbTruckDelivery,
    expandable: true,
    requiredPackage: {
      minPrice: 49.99,
      name: 'Professional',
    },
    subItems: [
      {
        label: 'Supplier List',
      },
      {
        label: 'Add/Edit Supplier',
      },
      {
        label: 'Purchase Orders',
      },
      {
        label: 'Pending Deliveries',
        requiredPackage: {
          minPrice: 99.99,
          name: 'Enterprise',
        },
      },
      {
        label: 'Stock Replenishment Requests',
        requiredPackage: {
          minPrice: 99.99,
          name: 'Enterprise',
        },
      },
      {
        label: 'Supplier Payments & Invoices',
        requiredPackage: {
          minPrice: 99.99,
          name: 'Enterprise',
        },
      },
    ],
  },
  {
    label: 'Employees & Cashiers',
    icon: FaUsers,
    expandable: true,
    requiredPackage: {
      minPrice: 49.99,
      name: 'Professional',
    },
    subItems: [
      {
        label: 'Employee List',
      },
      {
        label: 'Roles & Permissions',
      },
      {
        label: 'Cashier Sessions',
      },
      {
        label: 'Shift Management',
        requiredPackage: {
          minPrice: 99.99,
          name: 'Enterprise',
        },
      },
      {
        label: 'Attendance Tracking',
        requiredPackage: {
          minPrice: 99.99,
          name: 'Enterprise',
        },
      },
      {
        label: 'Activity Logs',
      },
    ],
  },
  {
    label: 'Reports & Analytics',
    icon: FaChartLine,
    expandable: true,
    requiredPackage: {
      minPrice: 49.99,
      name: 'Professional',
    },
    subItems: [
      {
        label: 'Sales Reports',
      },
      {
        label: 'Top-Selling Products Report',
      },
      {
        label: 'Profit & Loss Report',
        requiredPackage: {
          minPrice: 99.99,
          name: 'Enterprise',
        },
      },
      {
        label: 'Stock Movement Report',
      },
      {
        label: 'Employee Performance Report',
        requiredPackage: {
          minPrice: 99.99,
          name: 'Enterprise',
        },
      },
      {
        label: 'Customer Purchase Trends Report',
        requiredPackage: {
          minPrice: 99.99,
          name: 'Enterprise',
        },
      },
      {
        label: 'Tax & Compliance Reports',
        requiredPackage: {
          minPrice: 99.99,
          name: 'Enterprise',
        },
      },
      {
        label: 'Payment Method Breakdown',
      },
    ],
  },
  {
    label: 'Payments',
    icon: FaMoneyBillWave,
    expandable: true,
    requiredPackage: {
      minPrice: 29.99,
      name: 'Basic',
    },
    subItems: [
      {
        label: 'Accepted Payment Methods',
      },
      {
        label: 'Transaction History',
      },
      {
        label: 'Pending Payments',
      },
      {
        label: 'Refund Processing',
        requiredPackage: {
          minPrice: 49.99,
          name: 'Professional',
        },
      },
      {
        label: 'Cash Management',
        requiredPackage: {
          minPrice: 49.99,
          name: 'Professional',
        },
      },
    ],
  },
  {
    label: 'Expenses & Accounting',
    icon: BiReceipt,
    expandable: true,
    requiredPackage: {
      minPrice: 49.99,
      name: 'Professional',
    },
    subItems: [
      {
        label: 'Expense Tracking',
      },
      {
        label: 'Recurring Expenses',
        requiredPackage: {
          minPrice: 99.99,
          name: 'Enterprise',
        },
      },
      {
        label: 'Cash Flow Overview',
      },
      {
        label: 'Supplier Payments',
      },
      {
        label: 'Cash Management',
      },
      {
        label: 'Tax Calculations',
        requiredPackage: {
          minPrice: 99.99,
          name: 'Enterprise',
        },
      },
    ],
  },
  {
    label: 'Promotions & Discounts',
    icon: BsMegaphone,
    expandable: true,
    requiredPackage: {
      minPrice: 49.99,
      name: 'Professional',
    },
    subItems: [
      {
        label: 'Create New Discount',
      },
      {
        label: 'Active Promotions',
      },
      {
        label: 'Coupon & Voucher Management',
        requiredPackage: {
          minPrice: 99.99,
          name: 'Enterprise',
        },
      },
      {
        label: 'Seasonal & Flash Sales',
        requiredPackage: {
          minPrice: 99.99,
          name: 'Enterprise',
        },
      },
    ],
  },
  {
    label: 'Settings',
    icon: SettingsIcon,
    expandable: false,
  },
];

export const navbarLinks = [
  { label: 'Inventary', href: '/' },
  { label: 'Category', href: '/category' },
  { label: 'Brand', href: '/brand' },
  { label: 'Discount', href: '/discount' },
  { label: 'Stock', href: '/stock' },
];
