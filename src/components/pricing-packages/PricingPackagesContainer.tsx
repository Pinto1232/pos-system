"use client";

import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/api/axiosClient";

import styles from "./PricingPackages.module.css";
import PricingPackageCard from "./PricingPackageCard";
import { usePackageSelection } from "@/contexts/PackageSelectionContext";

interface PricingPackage {
  id: number;
  title: string;
  description: string;
  icon: string;
  extraDescription: string;
  price: number;
  testPeriodDays: number;
  type: "starter" | "growth" | "enterprise" | "custom";
}

const fetchPricingPackages = async (pageNumber: number, pageSize: number) => {
  const response = await axiosClient.get(
    `/PricingPackages?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
  return response.data;
};

const PricingPackagesContainer: React.FC = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["pricingPackages"],
    queryFn: () => fetchPricingPackages(1, 10),
  });

  const { selectPackage } = usePackageSelection();

  useEffect(() => {
    if (data) {
      console.log("📦 Retrieved Pricing Packages:", data);
    }
  }, [data]);

  if (isLoading) return <div className={styles.loading}>Loading pricing packages...</div>;
  if (error) return <div className={styles.error}>Error loading pricing packages</div>;

  // Map packages to ensure each one has a defined 'type'
  const packages: PricingPackage[] = data?.data.map((pkg: { type?: string; packageType?: string }) => ({
    ...pkg,
    type: pkg.type || pkg.packageType || "starter", 
  })) ?? [];

  return (
    <div className={styles.container}>
      {packages.map((pkg: PricingPackage) => (
        <PricingPackageCard
          key={pkg.id}
          packageData={pkg}
          onBuyNow={() => selectPackage(pkg)}
        />
      ))}
    </div>
  );
};

export default PricingPackagesContainer;
