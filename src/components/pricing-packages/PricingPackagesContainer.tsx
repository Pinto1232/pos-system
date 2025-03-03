"use client";

import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "@/api/axiosClient";
import styles from "./PricingPackages.module.css";
import PricingPackageCard from "./PricingPackageCard";
import { usePackageSelection, type Package } from "@/contexts/PackageSelectionContext";
import { AxiosInstance } from "axios";

type ApiResponse = {
  data: Array<{
    id: number;
    title: string;
    description: string;
    icon: string;
    extraDescription: string;
    price: number;
    testPeriodDays: number;
    type?: string;
    packageType?: string;
  }>;
};

const fetchPricingPackages = async (axiosClient: AxiosInstance, pageNumber: number, pageSize: number): Promise<ApiResponse> => {
  const response = await axiosClient.get(
    `/PricingPackages?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
  return response.data;
};

// Type guard for package types
const isPackageType = (type: string): type is Package['type'] => {
  return ["starter", "growth", "enterprise", "custom", "premium"].includes(type);
};

const PricingPackagesContainer: React.FC = () => {
  const { axiosClient } = useAxiosClient();
  const { data, error, isLoading } = useQuery({
    queryKey: ["pricingPackages"],
    queryFn: () => fetchPricingPackages(axiosClient, 1, 10),
  });

  const { selectPackage } = usePackageSelection();

  useEffect(() => {
    if (data) {
      console.log("📦 Retrieved Pricing Packages:", data);
    }
  }, [data]);

  if (isLoading) return <div className={styles.loading}>Loading pricing packages...</div>;
  if (error) return <div className={styles.error}>Error loading pricing packages</div>;

  const packages = (data?.data ?? []).map(pkg => {
    const type = pkg.type || pkg.packageType || "starter";
    return {
      ...pkg,
      type: isPackageType(type) ? type : "starter"
    } as Package;
  });

  return (
    <div className={styles.container}>
      {packages.map(pkg => (
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