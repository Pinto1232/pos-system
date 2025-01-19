"use client";


import React from "react";
import { useRouter } from "next/navigation"; // Use next/navigation instead of next/router

const PackageSelection = () => {
  const router = useRouter(); // Access router from next/navigation

  const handlePackageSelect = (packageType: string) => {
    if (packageType === "Starter") {
      router.push(`/subscription/starter-package/1`);
    } else if (packageType === "Custom") {
      router.push(`/subscription/custom-package/1`);
    }
  };

  return (
    <div>
      <h1>Package Selection</h1>
      <button onClick={() => handlePackageSelect("Starter")}>Starter Package</button>
      <button onClick={() => handlePackageSelect("Custom")}>Custom Package</button>
    </div>
  );
};

export default PackageSelection;
