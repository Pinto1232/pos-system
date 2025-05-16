import { NextResponse } from 'next/server';

// Mock packages data
const mockPackages = [
  {
    id: 1,
    title: 'Starter',
    description: 'Basic POS features;Inventory management;Sales reporting;Customer database;Email support;Cloud backup;Regular updates',
    type: 'starter',
    price: 29.99,
  },
  {
    id: 2,
    title: 'Growth',
    description: 'Everything in Starter;Multi-store support;Customer loyalty program;Priority support;Advanced reporting;Employee management',
    type: 'growth',
    price: 59.99,
  },
  {
    id: 3,
    title: 'Premium',
    description: 'Everything in Growth;Advanced inventory forecasting;Custom branding;24/7 support;API access;Advanced analytics;Multi-currency support',
    type: 'premium',
    price: 99.99,
  },
  {
    id: 4,
    title: 'Enterprise',
    description: 'Everything in Premium;Dedicated account manager;Custom development;White-label solution;Unlimited users;Advanced security features;Data migration assistance',
    type: 'enterprise',
    price: 199.99,
  },
];

export async function GET() {
  console.log('Fetching packages from simplified API endpoint');
  
  // Return the mock data
  return NextResponse.json(mockPackages);
}
