import { NextResponse } from 'next/server';

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5107';

export async function GET(
  request: Request,
  context: { params: { userId: string } }
) {
  const params = await context.params;
  const userId = params.userId;

  try {
    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

    if (!useMockData) {
      console.log(
        `Proxying GET request to backend for user features: ${userId}`
      );

      const response = await fetch(
        `${BACKEND_API_URL}/api/UserSubscription/user/${userId}/features`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },

          signal: AbortSignal.timeout(3000),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Successfully fetched user features from backend');
        return NextResponse.json(data);
      } else {
        console.warn(
          `Backend API returned status: ${response.status}, serving mock data`
        );
      }
    } else {
      console.log('Using mock data (NEXT_PUBLIC_USE_MOCK_DATA=true)');
    }

    const url = new URL(request.url);
    const testPackageType =
      url.searchParams.get('testPackage') ??
      process.env.NEXT_PUBLIC_TEST_PACKAGE_TYPE ??
      'starter-plus';

    console.log(`Using test package type: ${testPackageType}`);

    const getPackageFeatures = (packageType: string): string[] => {
      switch (packageType) {
        case 'starter-plus':
          return [
            'Dashboard',
            'Pricing Packages',
            'Products List',
            'Add/Edit Product',
            'Product Categories',
            'New Sale',
            'Sales History',
            'Invoices & Receipts',
            'Customer List',
            'Add/Edit Customer',
            'Sales Reports',
            'Stock Movement Report',
          ];
        case 'growth-pro':
          return [
            'Dashboard',
            'Pricing Packages',
            'Products List',
            'Add/Edit Product',
            'Product Categories',
            'Stock Levels & Alerts',
            'Low Stock Warnings',
            'Inventory Adjustments',
            'New Sale',
            'Sales History',
            'Invoices & Receipts',
            'Returns & Refunds',
            'Discounts & Promotions',
            'Pending Orders',
            'Completed Orders',
            'Customer List',
            'Add/Edit Customer',
            'Customer Groups',
            'Customer Purchase History',
            'Supplier List',
            'Add/Edit Supplier',
            'Purchase Orders',
            'Employee List',
            'Roles & Permissions',
            'Sales Reports',
            'Top-Selling Products Report',
            'Profit & Loss Report',
            'Stock Movement Report',
            'Employee Performance Report',
            'Transaction History',
            'Expense Tracking',
            'Create New Discount',
            'Active Promotions',
          ];
        case 'custom-pro':
          return [
            'Dashboard',
            'Pricing Packages',
            'Products List',
            'Add/Edit Product',
            'Product Categories',
            'Stock Levels & Alerts',
            'Low Stock Warnings',
            'Bulk Import/Export',
            'Inventory Adjustments',
            'Product Expiry Tracking',
            'New Sale',
            'Sales History',
            'Invoices & Receipts',
            'Returns & Refunds',
            'Discounts & Promotions',
            'Loyalty & Reward Points',
            'Pending Orders',
            'Completed Orders',
            'Cancelled Orders',
            'Pre-Orders',
            'Customer List',
            'Add/Edit Customer',
            'Customer Groups',
            'Customer Purchase History',
            'Loyalty Program',
            'Customer Feedback & Reviews',
            'Debt & Credit Management',
            'Supplier List',
            'Add/Edit Supplier',
            'Purchase Orders',
            'Pending Deliveries',
            'Stock Replenishment Requests',
            'Supplier Payments & Invoices',
            'Employee List',
            'Roles & Permissions',
            'Cashier Sessions',
            'Shift Management',
            'Attendance Tracking',
            'Activity Logs',
            'Sales Reports',
            'Top-Selling Products Report',
            'Profit & Loss Report',
            'Stock Movement Report',
            'Employee Performance Report',
            'Customer Purchase Trends Report',
            'Tax & Compliance Reports',
            'Payment Method Breakdown',
            'Accepted Payment Methods ',
            'Transaction History',
            'Pending Payments',
            'Refund Processing',
            'Cash Management',
            'Expense Tracking',
            'Recurring Expenses',
            'Cash Flow Overview',
            'Supplier Payments',
            'Tax Calculations',
            'Create New Discount',
            'Active Promotions',
            'Coupon & Voucher Management',
            'Seasonal & Flash Sales',
          ];
        case 'premium-plus':
        case 'enterprise-elite':
          return [
            'Dashboard',
            'Pricing Packages',
            'Products List',
            'Add/Edit Product',
            'Product Categories',
            'Stock Levels & Alerts',
            'Low Stock Warnings',
            'Bulk Import/Export',
            'Inventory Adjustments',
            'Product Expiry Tracking',
            'New Sale',
            'Sales History',
            'Invoices & Receipts',
            'Returns & Refunds',
            'Discounts & Promotions',
            'Loyalty & Reward Points',
            'Pending Orders',
            'Completed Orders',
            'Cancelled Orders',
            'Pre-Orders',
            'Customer List',
            'Add/Edit Customer',
            'Customer Groups',
            'Customer Purchase History',
            'Loyalty Program',
            'Customer Feedback & Reviews',
            'Debt & Credit Management',
            'Supplier List',
            'Add/Edit Supplier',
            'Purchase Orders',
            'Pending Deliveries',
            'Stock Replenishment Requests',
            'Supplier Payments & Invoices',
            'Employee List',
            'Roles & Permissions',
            'Cashier Sessions',
            'Shift Management',
            'Attendance Tracking',
            'Activity Logs',
            'Sales Reports',
            'Top-Selling Products Report',
            'Profit & Loss Report',
            'Stock Movement Report',
            'Employee Performance Report',
            'Customer Purchase Trends Report',
            'Tax & Compliance Reports',
            'Payment Method Breakdown',
            'Accepted Payment Methods ',
            'Transaction History',
            'Pending Payments',
            'Refund Processing',
            'Cash Management',
            'Expense Tracking',
            'Recurring Expenses',
            'Cash Flow Overview',
            'Supplier Payments',
            'Tax Calculations',
            'Create New Discount',
            'Active Promotions',
            'Coupon & Voucher Management',
            'Seasonal & Flash Sales',
            'Settings',
          ];
        default:
          return ['Dashboard', 'Pricing Packages', 'Products List'];
      }
    };

    return NextResponse.json(getPackageFeatures(testPackageType));
  } catch (error) {
    console.error(
      'Error proxying request to backend:',
      JSON.stringify(error, null, 2)
    );

    return NextResponse.json([
      'Dashboard',
      'Pricing Packages',
      'Products List',
      'Add/Edit Product',
      'Product Categories',
      'New Sale',
      'Sales History',
      'Invoices & Receipts',
      'Customer List',
      'Add/Edit Customer',
      'Sales Reports',
      'Stock Movement Report',
    ]);
  }
}
