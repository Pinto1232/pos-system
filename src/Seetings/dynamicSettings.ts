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
import pricingService from '@/api/pricingService';

export interface DynamicRequiredPackage {
  packageName: string;
  excludeFromPremiumPlus?: boolean;
}

export interface SidebarSubItem {
  label: string;
  translationKey?: string;
  requiredPackage?: DynamicRequiredPackage;
}

export interface SidebarItem {
  label: string;
  translationKey?: string;
  icon: ElementType;
  expandable?: boolean;
  requiredPackage?: DynamicRequiredPackage;
  subItems?: SidebarSubItem[];
  hasAccess?: boolean;
  isLocked?: boolean;
  requiredUpgrade?: DynamicRequiredPackage;
}

export const staticSidebarItems: SidebarItem[] = [
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
      packageName: 'Premium Plus',
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
          packageName: 'Premium Plus',
        },
      },
      {
        label: 'Low Stock Warnings',
        translationKey: 'sidebar.lowStockWarnings',
        requiredPackage: {
          packageName: 'Premium Plus',
        },
      },
      {
        label: 'Bulk Import/Export',
        translationKey: 'sidebar.bulkImportExport',
        requiredPackage: {
          packageName: 'Premium Plus',
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
          packageName: 'Premium Plus',
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
      packageName: 'Basic',
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
          packageName: 'Professional',
        },
      },
      {
        label: 'Discounts & Promotions',
        translationKey: 'sidebar.discountsPromotions',
        requiredPackage: {
          packageName: 'Professional',
        },
      },
      {
        label: 'Loyalty & Reward Points',
        translationKey: 'sidebar.loyaltyRewardPoints',
        requiredPackage: {
          packageName: 'Enterprise',
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
      packageName: 'Basic',
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
          packageName: 'Professional',
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
      packageName: 'Basic',
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
          packageName: 'Professional',
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
          packageName: 'Enterprise',
        },
      },
      {
        label: 'Customer Feedback & Reviews',
        translationKey: 'sidebar.customerFeedbackReviews',
        requiredPackage: {
          packageName: 'Professional',
        },
      },
      {
        label: 'Debt & Credit Management',
        translationKey: 'sidebar.debtCreditManagement',
        requiredPackage: {
          packageName: 'Enterprise',
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
      packageName: 'Professional',
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
          packageName: 'Enterprise',
        },
      },
      {
        label: 'Stock Replenishment Requests',
        translationKey: 'sidebar.stockReplenishmentRequests',
        requiredPackage: {
          packageName: 'Enterprise',
        },
      },
      {
        label: 'Supplier Payments & Invoices',
        translationKey: 'sidebar.supplierPaymentsInvoices',
        requiredPackage: {
          packageName: 'Enterprise',
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
      packageName: 'Professional',
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
          packageName: 'Enterprise',
        },
      },
      {
        label: 'Attendance Tracking',
        translationKey: 'sidebar.attendanceTracking',
        requiredPackage: {
          packageName: 'Enterprise',
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
      packageName: 'Professional',
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
          packageName: 'Enterprise',
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
          packageName: 'Enterprise',
        },
      },
      {
        label: 'Customer Purchase Trends Report',
        translationKey: 'sidebar.customerPurchaseTrendsReport',
        requiredPackage: {
          packageName: 'Enterprise',
        },
      },
      {
        label: 'Tax & Compliance Reports',
        translationKey: 'sidebar.taxComplianceReports',
        requiredPackage: {
          packageName: 'Enterprise',
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
      packageName: 'Basic',
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
          packageName: 'Professional',
        },
      },
      {
        label: 'Cash Management',
        translationKey: 'sidebar.cashManagement',
        requiredPackage: {
          packageName: 'Professional',
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
      packageName: 'Professional',
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
          packageName: 'Enterprise',
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
          packageName: 'Enterprise',
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
      packageName: 'Professional',
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
          packageName: 'Enterprise',
        },
      },
      {
        label: 'Seasonal Campaigns',
        translationKey: 'sidebar.seasonalCampaigns',
        requiredPackage: {
          packageName: 'Enterprise',
        },
      },
      {
        label: 'A/B Testing for Promotions',
        translationKey: 'sidebar.abTestingPromotions',
        requiredPackage: {
          packageName: 'Enterprise',
        },
      },
    ],
  },
  {
    label: 'Settings',
    translationKey: 'sidebar.settings',
    icon: SettingsIcon,
    expandable: true,
    subItems: [
      {
        label: 'General Settings',
        translationKey: 'sidebar.generalSettings',
      },
      {
        label: 'User Permissions',
        translationKey: 'sidebar.userPermissions',
      },
      {
        label: 'Notification Settings',
        translationKey: 'sidebar.notificationSettings',
      },
      {
        label: 'Backup & Recovery',
        translationKey: 'sidebar.backupRecovery',
        requiredPackage: {
          packageName: 'Professional',
        },
      },
      {
        label: 'API Management',
        translationKey: 'sidebar.apiManagement',
        requiredPackage: {
          packageName: 'Enterprise',
        },
      },
      {
        label: 'Advanced Customization',
        translationKey: 'sidebar.advancedCustomization',
        requiredPackage: {
          packageName: 'Enterprise',
        },
      },
    ],
  },
];

export interface LegacySidebarItem {
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

async function transformToLegacyFormat(
  items: SidebarItem[]
): Promise<LegacySidebarItem[]> {
  const packagePriceCache = new Map<
    string,
    { price: number; currency: string }
  >();

  const getPackagePricing = async (packageName: string) => {
    if (packagePriceCache.has(packageName)) {
      return packagePriceCache.get(packageName)!;
    }

    const pricingInfo = await pricingService.getPackagePricingInfo(packageName);
    const result = {
      price: pricingInfo.minPrice,
      currency: pricingInfo.currency,
    };
    packagePriceCache.set(packageName, result);
    return result;
  };

  const transformedItems: LegacySidebarItem[] = [];

  for (const item of items) {
    const transformedItem: LegacySidebarItem = {
      label: item.label,
      translationKey: item.translationKey,
      icon: item.icon,
      expandable: item.expandable,
      hasAccess: item.hasAccess,
      isLocked: item.isLocked,
    };

    if (item.requiredPackage) {
      const pricing = await getPackagePricing(item.requiredPackage.packageName);
      transformedItem.requiredPackage = {
        minPrice: pricing.price,
        name: item.requiredPackage.packageName,
        excludeFromPremiumPlus: item.requiredPackage.excludeFromPremiumPlus,
      };
    }

    if (item.requiredUpgrade) {
      const pricing = await getPackagePricing(item.requiredUpgrade.packageName);
      transformedItem.requiredUpgrade = {
        minPrice: pricing.price,
        name: item.requiredUpgrade.packageName,
        excludeFromPremiumPlus: item.requiredUpgrade.excludeFromPremiumPlus,
      };
    }

    if (item.subItems) {
      transformedItem.subItems = [];
      for (const subItem of item.subItems) {
        const transformedSubItem: {
          label: string;
          translationKey?: string;
          requiredPackage?: {
            minPrice: number;
            name: string;
            excludeFromPremiumPlus?: boolean;
          };
        } = {
          label: subItem.label,
          translationKey: subItem.translationKey,
        };

        if (subItem.requiredPackage) {
          const pricing = await getPackagePricing(
            subItem.requiredPackage.packageName
          );
          transformedSubItem.requiredPackage = {
            minPrice: pricing.price,
            name: subItem.requiredPackage.packageName,
            excludeFromPremiumPlus:
              subItem.requiredPackage.excludeFromPremiumPlus,
          };
        }

        transformedItem.subItems.push(transformedSubItem);
      }
    }

    transformedItems.push(transformedItem);
  }

  return transformedItems;
}

export async function getSidebarItems(): Promise<LegacySidebarItem[]> {
  try {
    return await transformToLegacyFormat(staticSidebarItems);
  } catch (error) {
    console.error('Failed to fetch dynamic pricing for sidebar:', error);

    return staticSidebarItems.map((item) => ({
      ...item,
      requiredPackage: item.requiredPackage
        ? {
            minPrice: 0,
            name: item.requiredPackage.packageName,
            excludeFromPremiumPlus: item.requiredPackage.excludeFromPremiumPlus,
          }
        : undefined,
      requiredUpgrade: item.requiredUpgrade
        ? {
            minPrice: 0,
            name: item.requiredUpgrade.packageName,
            excludeFromPremiumPlus: item.requiredUpgrade.excludeFromPremiumPlus,
          }
        : undefined,
      subItems: item.subItems?.map((subItem) => ({
        ...subItem,
        requiredPackage: subItem.requiredPackage
          ? {
              minPrice: 0,
              name: subItem.requiredPackage.packageName,
              excludeFromPremiumPlus:
                subItem.requiredPackage.excludeFromPremiumPlus,
            }
          : undefined,
      })),
    }));
  }
}

export { staticSidebarItems as sidebarItems };

export function refreshPricingCache(): void {
  pricingService.clearCache();
}

export async function getPackagePricing(packageName: string) {
  return await pricingService.getPackagePricingInfo(packageName);
}

export default staticSidebarItems;
