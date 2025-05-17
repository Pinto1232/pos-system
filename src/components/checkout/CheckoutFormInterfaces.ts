import { ChangeEvent, FormEvent } from 'react';

export interface CheckoutField {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  options?: string[];
}

export interface OrderSummaryItem {
  label: string;
  value: string | number;
  description?: string;
}

export interface CheckoutFormProps {
  title?: string;
  checkoutFields: CheckoutField[];
  orderSummaryTitle?: string;
  orderSummaryItems: OrderSummaryItem[];
  formData: Record<string, string>;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent) => void;
}
