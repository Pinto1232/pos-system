'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import CheckoutForm from './CheckoutForm';
import { CheckoutField, OrderSummaryItem } from './CheckoutFormInterfaces';

const CheckoutContainer: React.FC = () => {
  const checkoutFields: CheckoutField[] = [
    {
      label: 'First Name',
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      label: 'Last Name',
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      label: 'Email',
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      label: 'Phone Number',
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      label: 'Address',
      name: 'address',
      type: 'text',
      required: true,
    },
    {
      label: 'Country',
      name: 'country',
      type: 'text',
      required: true,
    },
    {
      label: 'State / Province / Region',
      name: 'state',
      type: 'text',
      required: true,
    },
    {
      label: 'City',
      name: 'city',
      type: 'text',
      required: true,
    },
    {
      label: 'Postal / Zip Code',
      name: 'postal',
      type: 'text',
      required: true,
    },
  ];

  const orderSummaryItems: OrderSummaryItem[] = [
    {
      label: 'Start Plan',
      value: 'Feb 06 - Mar 03 07:00 AM - 09:00 AM (GMT +05:00)',
    },
    {
      label: 'Transactions',
      value: 'R2,000,000',
    },
    {
      label: 'Discount points',
      value: 'R0.00',
    },
    {
      label: 'Gift card and coupon',
      value: 'R0.00',
    },
    {
      label: 'Grand Total',
      value: 'R2,000,000',
    },
  ];

  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    console.log('Form submitted:', JSON.stringify(formData, null, 2));
  };

  return (
    <CheckoutForm
      title="Enter Your Detail"
      checkoutFields={checkoutFields}
      orderSummaryTitle="Order Summary"
      orderSummaryItems={orderSummaryItems}
      formData={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
};

export default CheckoutContainer;
