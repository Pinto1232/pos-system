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
import { MegaMenuItem } from '@/components/mega-menu';

export interface SidebarItem {
  label: string;
  translationKey?: string;
  icon: ElementType;
  expandable?: boolean;
  requiredPackage?: {
    minPrice: number;
    name: string;
    excludeFromPremiumPlus?: boolean;
  };
  subItems?: Array<{
    label: string;
    translationKey?: string;
    requiredPackage?: {
      minPrice: number;
      name: string;
      excludeFromPremiumPlus?: boolean;
    };
  }>;

  hasAccess?: boolean;
  isLocked?: boolean;
  requiredUpgrade?: {
    minPrice: number;
    name: string;
    excludeFromPremiumPlus?: boolean;
  };
}

export const sidebarItems: SidebarItem[] = [
  {
    label: 'Dashboard',
    translationKey: 'sidebar.dashboard',
    icon: HomeIcon,
  },
  {
    label: 'Pricing Packages',
    translationKey: 'sidebar.pricingPackages',
    icon: MdAttachMoney,
  },
  {
    label: 'Products & Inventory',
    translationKey: 'sidebar.productsInventory',
    icon: MdProductionQuantityLimits,
    expandable: true,
    requiredPackage: {
      minPrice: 149.99,
      name: 'Premium Plus',
    },
    subItems: [
      {
        label: 'Products List',
        translationKey: 'sidebar.productsList',
      },
      {
        label: 'Add/Edit Product',
        translationKey: 'sidebar.addEditProduct',
      },
      {
        label: 'Product Categories',
        translationKey: 'sidebar.productCategories',
      },
      {
        label: 'Stock Levels & Alerts',
        translationKey: 'sidebar.stockLevelsAlerts',
        requiredPackage: {
          minPrice: 149.99,
          name: 'Premium Plus',
        },
      },
      {
        label: 'Low Stock Warnings',
        translationKey: 'sidebar.lowStockWarnings',
        requiredPackage: {
          minPrice: 149.99,
          name: 'Premium Plus',
        },
      },
      {
        label: 'Bulk Import/Export',
        translationKey: 'sidebar.bulkImportExport',
        requiredPackage: {
          minPrice: 149.99,
          name: 'Premium Plus',
        },
      },
      {
        label: 'Inventory Adjustments',
        translationKey: 'sidebar.inventoryAdjustments',
      },
      {
        label: 'Product Expiry Tracking',
        translationKey: 'sidebar.productExpiryTracking',
        requiredPackage: {
          minPrice: 149.99,
          name: 'Premium Plus',
        },
      },
    ],
  },
  {
    label: 'Sales',
    translationKey: 'sidebar.sales',
    icon: FaCreditCard,
    expandable: true,
    requiredPackage: {
      minPrice: 29.99,
      name: 'Basic',
    },
    subItems: [
      {
        label: 'New Sale',
        translationKey: 'sidebar.newSale',
      },
      {
        label: 'Sales History',
        translationKey: 'sidebar.salesHistory',
      },
      {
        label: 'Invoices & Receipts',
        translationKey: 'sidebar.invoicesReceipts',
      },
      {
        label: 'Returns & Refunds',
        translationKey: 'sidebar.returnsRefunds',
        requiredPackage: {
          minPrice: 49.99,
          name: 'Professional',
        },
      },
      {
        label: 'Discounts & Promotions',
        translationKey: 'sidebar.discountsPromotions',
        requiredPackage: {
          minPrice: 49.99,
          name: 'Professional',
        },
      },
      {
        label: 'Loyalty & Reward Points',
        translationKey: 'sidebar.loyaltyRewardPoints',
        requiredPackage: {
          minPrice: 99.99,
          name: 'Enterprise',
        },
      },
    ],
  },
  {
    label: 'Orders',
    translationKey: 'sidebar.orders',
    icon: TbReorder,
    expandable: true,
    requiredPackage: {
      minPrice: 29.99,
      name: 'Basic',
    },
    subItems: [
      {
        label: 'Pending Orders',
        translationKey: 'sidebar.pendingOrders',
      },
      {
        label: 'Completed Orders',
        translationKey: 'sidebar.completedOrders',
      },
      {
        label: 'Cancelled Orders',
        translationKey: 'sidebar.cancelledOrders',
      },
      {
        label: 'Pre-Orders',
        translationKey: 'sidebar.preOrders',
        requiredPackage: {
          minPrice: 49.99,
          name: 'Professional',
        },
      },
    ],
  },
  {
    label: 'Customers',
    translationKey: 'sidebar.customers',
    icon: RiCustomerService2Fill,
    expandable: true,
    requiredPackage: {
      minPrice: 29.99,
      name: 'Basic',
    },
    subItems: [
      {
        label: 'Customer List',
        translationKey: 'sidebar.customerList',
      },
      {
        label: 'Add/Edit Customer',
        translationKey: 'sidebar.addEditCustomer',
      },
      {
        label: 'Customer Groups',
        translationKey: 'sidebar.customerGroups',
        requiredPackage: {
          minPrice: 49.99,
          name: 'Professional',
        },
      },
      {
        label: 'Customer Purchase History',
        translationKey: 'sidebar.customerPurchaseHistory',
      },
      {
        label: 'Loyalty Program',
        translationKey: 'sidebar.loyaltyProgram',
        requiredPackage: {
          minPrice: 99.99,
          name: 'Enterprise',
        },
      },
      {
        label: 'Customer Feedback & Reviews',
        translationKey: 'sidebar.customerFeedbackReviews',
        requiredPackage: {
          minPrice: 49.99,
          name: 'Professional',
        },
      },
      {
        label: 'Debt & Credit Management',
        translationKey: 'sidebar.debtCreditManagement',
        requiredPackage: {
          minPrice: 99.99,
          name: 'Enterprise',
        },
      },
    ],
  },
  {
    label: 'Suppliers & Purchases',
    translationKey: 'sidebar.suppliersPurchases',
    icon: TbTruckDelivery,
    expandable: true,
    requiredPackage: {
      minPrice: 49.99,
      name: 'Professional',
    },
    subItems: [
      {
        label: 'Supplier List',
        translationKey: 'sidebar.supplierList',
      },
      {
        label: 'Add/Edit Supplier',
        translationKey: 'sidebar.addEditSupplier',
      },
      {
        label: 'Purchase Orders',
        translationKey: 'sidebar.purchaseOrders',
      },
      {
        label: 'Pending Deliveries',
        translationKey: 'sidebar.pendingDeliveries',
        requiredPackage: {
          minPrice: 99.99,
          name: 'Enterprise',
        },
      },
      {
        label: 'Stock Replenishment Requests',
        translationKey: 'sidebar.stockReplenishmentRequests',
        requiredPackage: {
          minPrice: 99.99,
          name: 'Enterprise',
        },
      },
      {
        label: 'Supplier Payments & Invoices',
        translationKey: 'sidebar.supplierPaymentsInvoices',
        requiredPackage: {
          minPrice: 99.99,
          name: 'Enterprise',
        },
      },
    ],
  },
  {
    label: 'Employees & Cashiers',
    translationKey: 'sidebar.employeesCashiers',
    icon: FaUsers,
    expandable: true,
    requiredPackage: {
      minPrice: 49.99,
      name: 'Professional',
    },
    subItems: [
      {
        label: 'Employee List',
        translationKey: 'sidebar.employeeList',
      },
      {
        label: 'Roles & Permissions',
        translationKey: 'sidebar.rolesPermissions',
      },
      {
        label: 'Cashier Sessions',
        translationKey: 'sidebar.cashierSessions',
      },
      {
        label: 'Shift Management',
        translationKey: 'sidebar.shiftManagement',
        requiredPackage: {
          minPrice: 99.99,
          name: 'Enterprise',
        },
      },
      {
        label: 'Attendance Tracking',
        translationKey: 'sidebar.attendanceTracking',
        requiredPackage: {
          minPrice: 99.99,
          name: 'Enterprise',
        },
      },
      {
        label: 'Activity Logs',
        translationKey: 'sidebar.activityLogs',
      },
    ],
  },
  {
    label: 'Reports & Analytics',
    translationKey: 'sidebar.reportsAnalytics',
    icon: FaChartLine,
    expandable: true,
    requiredPackage: {
      minPrice: 49.99,
      name: 'Professional',
    },
    subItems: [
      {
        label: 'Sales Reports',
        translationKey: 'sidebar.salesReports',
      },
      {
        label: 'Top-Selling Products Report',
        translationKey: 'sidebar.topSellingProductsReport',
      },
      {
        label: 'Profit & Loss Report',
        translationKey: 'sidebar.profitLossReport',
        requiredPackage: {
          minPrice: 99.99,
          name: 'Enterprise',
        },
      },
      {
        label: 'Stock Movement Report',
        translationKey: 'sidebar.stockMovementReport',
      },
      {
        label: 'Employee Performance Report',
        translationKey: 'sidebar.employeePerformanceReport',
        requiredPackage: {
          minPrice: 99.99,
          name: 'Enterprise',
        },
      },
      {
        label: 'Customer Purchase Trends Report',
        translationKey: 'sidebar.customerPurchaseTrendsReport',
        requiredPackage: {
          minPrice: 99.99,
          name: 'Enterprise',
        },
      },
      {
        label: 'Tax & Compliance Reports',
        translationKey: 'sidebar.taxComplianceReports',
        requiredPackage: {
          minPrice: 99.99,
          name: 'Enterprise',
        },
      },
      {
        label: 'Payment Method Breakdown',
        translationKey: 'sidebar.paymentMethodBreakdown',
      },
    ],
  },
  {
    label: 'Payments',
    translationKey: 'sidebar.payments',
    icon: FaMoneyBillWave,
    expandable: true,
    requiredPackage: {
      minPrice: 29.99,
      name: 'Basic',
    },
    subItems: [
      {
        label: 'Accepted Payment Methods',
        translationKey: 'sidebar.acceptedPaymentMethods',
      },
      {
        label: 'Transaction History',
        translationKey: 'sidebar.transactionHistory',
      },
      {
        label: 'Pending Payments',
        translationKey: 'sidebar.pendingPayments',
      },
      {
        label: 'Refund Processing',
        translationKey: 'sidebar.refundProcessing',
        requiredPackage: {
          minPrice: 49.99,
          name: 'Professional',
        },
      },
      {
        label: 'Cash Management',
        translationKey: 'sidebar.cashManagement',
        requiredPackage: {
          minPrice: 49.99,
          name: 'Professional',
        },
      },
    ],
  },
  {
    label: 'Expenses & Accounting',
    translationKey: 'sidebar.expensesAccounting',
    icon: BiReceipt,
    expandable: true,
    requiredPackage: {
      minPrice: 49.99,
      name: 'Professional',
    },
    subItems: [
      {
        label: 'Expense Tracking',
        translationKey: 'sidebar.expenseTracking',
      },
      {
        label: 'Recurring Expenses',
        translationKey: 'sidebar.recurringExpenses',
        requiredPackage: {
          minPrice: 99.99,
          name: 'Enterprise',
        },
      },
      {
        label: 'Cash Flow Overview',
        translationKey: 'sidebar.cashFlowOverview',
      },
      {
        label: 'Supplier Payments',
        translationKey: 'sidebar.supplierPayments',
      },
      {
        label: 'Cash Management',
        translationKey: 'sidebar.expensesCashManagement',
      },
      {
        label: 'Tax Calculations',
        translationKey: 'sidebar.taxCalculations',
        requiredPackage: {
          minPrice: 99.99,
          name: 'Enterprise',
        },
      },
    ],
  },
  {
    label: 'Promotions & Discounts',
    translationKey: 'sidebar.promotionsDiscounts',
    icon: BsMegaphone,
    expandable: true,
    requiredPackage: {
      minPrice: 49.99,
      name: 'Professional',
    },
    subItems: [
      {
        label: 'Create New Discount',
        translationKey: 'sidebar.createNewDiscount',
      },
      {
        label: 'Active Promotions',
        translationKey: 'sidebar.activePromotions',
      },
      {
        label: 'Coupon & Voucher Management',
        translationKey: 'sidebar.couponVoucherManagement',
        requiredPackage: {
          minPrice: 99.99,
          name: 'Enterprise',
        },
      },
      {
        label: 'Seasonal & Flash Sales',
        translationKey: 'sidebar.seasonalFlashSales',
        requiredPackage: {
          minPrice: 99.99,
          name: 'Enterprise',
        },
      },
    ],
  },
  {
    label: 'Settings',
    translationKey: 'sidebar.settings',
    icon: SettingsIcon,
    expandable: false,
  },
];

export const navbarLinks = [
  { label: 'Inventory', translationKey: 'navbar.inventory', href: '/' },
  { label: 'Category', translationKey: 'navbar.category', href: '/category' },
  { label: 'Brand', translationKey: 'navbar.brand', href: '/brand' },
  { label: 'Discount', translationKey: 'navbar.discount', href: '/discount' },
  { label: 'Stock', translationKey: 'navbar.stock', href: '/stock' },
];

export const megaMenuItems: MegaMenuItem[] = [
  {
    id: 'pos',
    title: 'POS',
    translationKey: 'navbar.pos',
    columns: [
      {
        id: 'pos-features',
        title: 'POS Features',
        items: [
          {
            id: 'checkout',
            title: 'Checkout',
            link: '/pos/checkout',
            description: 'Process sales and transactions',
          },
          {
            id: 'orders',
            title: 'Orders',
            link: '/pos/orders',
            description: 'View and manage orders',
          },
          {
            id: 'returns',
            title: 'Returns & Refunds',
            link: '/pos/returns',
            description: 'Process returns and refunds',
            badge: {
              text: 'New',
              color: 'success',
            },
          },
        ],
      },
      {
        id: 'pos-settings',
        title: 'POS Settings',
        items: [
          {
            id: 'terminals',
            title: 'Terminals',
            link: '/pos/terminals',
            description: 'Manage POS terminals',
          },
          {
            id: 'payment-methods',
            title: 'Payment Methods',
            link: '/pos/payment-methods',
            description: 'Configure payment options',
          },
          {
            id: 'receipts',
            title: 'Receipt Templates',
            link: '/pos/receipts',
            description: 'Customize receipt layouts',
          },
        ],
      },
      {
        id: 'customer-management',
        title: 'Customer Management',
        items: [
          {
            id: 'customer-database',
            title: 'Customer Database',
            link: '/pos/customers',
            description: 'Manage customer information',
          },
          {
            id: 'customer-history',
            title: 'Purchase History',
            link: '/pos/customer-history',
            description: 'View customer purchase records',
          },
          {
            id: 'customer-feedback',
            title: 'Feedback & Reviews',
            link: '/pos/customer-feedback',
            description: 'Manage customer feedback',
            badge: {
              text: 'New',
              color: 'success',
            },
          },
        ],
      },
      {
        id: 'loyalty-programs',
        title: 'Gift Cards & Loyalty',
        items: [
          {
            id: 'gift-cards',
            title: 'Gift Cards',
            link: '/pos/gift-cards',
            description: 'Manage and issue gift cards',
          },
          {
            id: 'loyalty-program',
            title: 'Loyalty Program',
            link: '/pos/loyalty',
            description: 'Configure points and rewards',
          },
          {
            id: 'promotions',
            title: 'Special Promotions',
            link: '/pos/promotions',
            description: 'Create and manage promotions',
            badge: {
              text: 'Pro',
              color: 'primary',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'inventory',
    title: 'Inventory',
    translationKey: 'navbar.inventory',
    columns: [
      {
        id: 'inventory-management',
        title: 'Inventory Management',
        items: [
          {
            id: 'products',
            title: 'Products',
            link: '/inventory/products',
            description: 'Manage your product catalog',
          },
          {
            id: 'categories',
            title: 'Categories',
            link: '/inventory/categories',
            description: 'Organize products by category',
          },
          {
            id: 'stock',
            title: 'Stock Control',
            link: '/inventory/stock',
            description: 'Monitor and adjust stock levels',
          },
        ],
      },
      {
        id: 'inventory-operations',
        title: 'Operations',
        items: [
          {
            id: 'receiving',
            title: 'Receiving',
            link: '/inventory/receiving',
            description: 'Process incoming inventory',
          },
          {
            id: 'transfers',
            title: 'Transfers',
            link: '/inventory/transfers',
            description: 'Move inventory between locations',
          },
          {
            id: 'adjustments',
            title: 'Adjustments',
            link: '/inventory/adjustments',
            description: 'Make inventory corrections',
          },
        ],
      },
    ],
  },
  {
    id: 'reports',
    title: 'Reports',
    translationKey: 'navbar.reports',
    columns: [
      {
        id: 'sales-reports',
        title: 'Sales Reports',
        items: [
          {
            id: 'sales-summary',
            title: 'Sales Summary',
            link: '/reports/sales-summary',
            description: 'Overview of sales performance',
          },
          {
            id: 'product-sales',
            title: 'Product Sales',
            link: '/reports/product-sales',
            description: 'Sales by product',
          },
          {
            id: 'payment-methods',
            title: 'Payment Methods',
            link: '/reports/payment-methods',
            description: 'Sales by payment method',
          },
        ],
      },
      {
        id: 'inventory-reports',
        title: 'Inventory Reports',
        items: [
          {
            id: 'inventory-valuation',
            title: 'Inventory Valuation',
            link: '/reports/inventory-valuation',
            description: 'Current value of inventory',
            badge: {
              text: 'Pro',
              color: 'primary',
            },
          },
          {
            id: 'low-stock',
            title: 'Low Stock',
            link: '/reports/low-stock',
            description: 'Products with low stock levels',
          },
          {
            id: 'inventory-movement',
            title: 'Inventory Movement',
            link: '/reports/inventory-movement',
            description: 'Track inventory changes',
          },
        ],
      },
    ],
  },
];
