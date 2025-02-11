// src/components/PricingPackages.tsx
'use client';

import React, { useContext, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/api/axiosClient';
import { AuthContext } from '@/contexts/AuthContext';

interface PricingPackage {
  id: number;
  title: string;
  description: string;
  icon: string;
  extraDescription: string;
  price: number;
  testPeriodDays: number;
}

// Function to fetch pricing packages (with pagination parameters)
const fetchPricingPackages = async (pageNumber: number, pageSize: number) => {
  const response = await axiosClient.get(
    `/PricingPackages?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
  return response.data;
};

const PricingPackages = () => {
  // Using the AuthContext ensures authentication is loaded before API calls
  useContext(AuthContext);

  const { data, error, isLoading } = useQuery({
    queryKey: ['pricingPackages'],
    queryFn: () => fetchPricingPackages(1, 10),
  });

  useEffect(() => {
    if (data) {
      console.log('📦 Retrieved Pricing Packages:', data);
    }
  }, [data]);

  if (isLoading) {
    return <div>Loading pricing packages...</div>;
  }
  if (error) {
    return <div>Error loading pricing packages</div>;
  }

  return (
    <div>
      <h1>Pricing Packages</h1>
      <ul>
        {data?.data.map((pkg: PricingPackage) => (
          <li key={pkg.id}>
            <h2>{pkg.title}</h2>
            <p>{pkg.description}</p>
            <p>Price: ${pkg.price}</p>
            <p>Test Period: {pkg.testPeriodDays} days</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PricingPackages;
