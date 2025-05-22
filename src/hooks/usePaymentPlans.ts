'use client';

import { useState, useEffect, useCallback } from 'react';
import { PaymentPlan, PaymentPlansResponse } from '@/app/api/payment-plans/route';

interface UsePaymentPlansOptions {
  currency?: string;
  region?: string;
  userType?: string;
  autoFetch?: boolean;
}

interface UsePaymentPlansReturn {
  paymentPlans: PaymentPlan[];
  defaultPlanId: number | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getDiscountPercentage: (planId: number) => number;
  getPlanById: (planId: number) => PaymentPlan | undefined;
  getApplicablePlans: (userType?: string, region?: string) => PaymentPlan[];
}

export const usePaymentPlans = (options: UsePaymentPlansOptions = {}): UsePaymentPlansReturn => {
  const {
    currency = 'USD',
    region,
    userType,
    autoFetch = true,
  } = options;

  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([]);
  const [defaultPlanId, setDefaultPlanId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPaymentPlans = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        currency,
        ...(region && { region }),
        ...(userType && { userType }),
      });

      const response = await fetch(`/api/payment-plans?${queryParams}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch payment plans: ${response.status}`);
      }

      const data: PaymentPlansResponse = await response.json();
      
      setPaymentPlans(data.plans);
      setDefaultPlanId(data.defaultPlanId);
      
      console.log(`Loaded ${data.plans.length} payment plans for currency: ${currency}`);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching payment plans:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currency, region, userType]);

  useEffect(() => {
    if (autoFetch) {
      fetchPaymentPlans();
    }
  }, [fetchPaymentPlans, autoFetch]);

  const getDiscountPercentage = useCallback((planId: number): number => {
    const plan = paymentPlans.find(p => p.id === planId);
    return plan?.discountPercentage || 0;
  }, [paymentPlans]);

  const getPlanById = useCallback((planId: number): PaymentPlan | undefined => {
    return paymentPlans.find(p => p.id === planId);
  }, [paymentPlans]);

  const getApplicablePlans = useCallback((
    filterUserType?: string, 
    filterRegion?: string
  ): PaymentPlan[] => {
    return paymentPlans.filter(plan => {
      // Check if plan is applicable for user type
      const userTypeMatch = !filterUserType || 
        plan.applicableUserTypes.includes('*') || 
        plan.applicableUserTypes.includes(filterUserType);

      // Check if plan is applicable for region
      const regionMatch = !filterRegion || 
        plan.applicableRegions.includes('*') || 
        plan.applicableRegions.includes(filterRegion);

      // Check if plan is currently valid (if dates are specified)
      const now = new Date();
      const validFromMatch = !plan.validFrom || new Date(plan.validFrom) <= now;
      const validToMatch = !plan.validTo || new Date(plan.validTo) >= now;

      return userTypeMatch && regionMatch && validFromMatch && validToMatch;
    });
  }, [paymentPlans]);

  return {
    paymentPlans,
    defaultPlanId,
    isLoading,
    error,
    refetch: fetchPaymentPlans,
    getDiscountPercentage,
    getPlanById,
    getApplicablePlans,
  };
};
