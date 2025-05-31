import {
  SubscriptionDetails,
  BillingHistoryItem,
  ChangePlanRequest,
  UpdatePaymentMethodRequest,
  SubscriptionActionRequest,
} from '@/types/settingsTypes';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export class SubscriptionManagementService {
  private static async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${BACKEND_URL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return response.json();
  }

  static async getSubscriptionDetails(
    userId: string
  ): Promise<SubscriptionDetails | null> {
    try {
      return await this.makeRequest<SubscriptionDetails>(
        `/api/SubscriptionManagement/user/${userId}/details`
      );
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  static async getBillingHistory(
    userId: string,
    limit: number = 10
  ): Promise<BillingHistoryItem[]> {
    return this.makeRequest<BillingHistoryItem[]>(
      `/api/SubscriptionManagement/user/${userId}/billing-history?limit=${limit}`
    );
  }

  static async changePlan(
    request: ChangePlanRequest
  ): Promise<{ message: string; subscription: any }> {
    return this.makeRequest<{ message: string; subscription: any }>(
      '/api/SubscriptionManagement/change-plan',
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
  }

  static async updatePaymentMethod(
    request: UpdatePaymentMethodRequest
  ): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>(
      '/api/SubscriptionManagement/update-payment-method',
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
  }

  static async pauseSubscription(
    request: SubscriptionActionRequest
  ): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>(
      '/api/SubscriptionManagement/pause',
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
  }

  static async resumeSubscription(
    request: SubscriptionActionRequest
  ): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>(
      '/api/SubscriptionManagement/resume',
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
  }

  static async cancelSubscription(
    userId: string,
    cancelImmediately: boolean = false
  ): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>('/api/Subscription/cancel', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        cancelImmediately,
      }),
    });
  }

  static async reactivateSubscription(
    request: SubscriptionActionRequest
  ): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>(
      '/api/Subscription/reactivate',
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
  }

  static async getAvailablePackages(): Promise<any[]> {
    return this.makeRequest<any[]>('/api/PricingPackages');
  }

  static formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  }

  static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  static getStatusDisplay(status: string): { text: string; color: string } {
    switch (status.toLowerCase()) {
      case 'active':
        return { text: 'Active', color: '#4CAF50' };
      case 'trialing':
        return { text: 'Trial', color: '#2196F3' };
      case 'past_due':
        return { text: 'Past Due', color: '#FF9800' };
      case 'canceled':
        return { text: 'Canceled', color: '#F44336' };
      case 'paused':
        return { text: 'Paused', color: '#9E9E9E' };
      case 'incomplete':
        return { text: 'Incomplete', color: '#FF5722' };
      case 'incomplete_expired':
        return { text: 'Expired', color: '#F44336' };
      case 'unpaid':
        return { text: 'Unpaid', color: '#F44336' };
      default:
        return { text: status, color: '#757575' };
    }
  }

  static canModifySubscription(status: string): boolean {
    const modifiableStatuses = ['active', 'trialing', 'past_due', 'paused'];
    return modifiableStatuses.includes(status.toLowerCase());
  }

  static canPauseSubscription(status: string): boolean {
    const pausableStatuses = ['active', 'trialing'];
    return pausableStatuses.includes(status.toLowerCase());
  }

  static canResumeSubscription(status: string): boolean {
    return status.toLowerCase() === 'paused';
  }

  static canReactivateSubscription(
    status: string,
    cancelAtPeriodEnd: boolean
  ): boolean {
    return (
      (status.toLowerCase() === 'active' && cancelAtPeriodEnd) ||
      status.toLowerCase() === 'canceled'
    );
  }
}

export default SubscriptionManagementService;
