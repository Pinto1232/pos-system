"use client"; // Mark the component as a Client Component

import React from "react";
import { useRouter } from "next/navigation"; // Use next/navigation instead of next/router

const CustomPackage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { id } = params; // Access dynamic route parameter

  const handleCustomize = () => {
    router.push(`/subscription/customization/${id}`); // Navigate to customization page
  };

  const handleCancel = () => {
    router.push(`/subscription/package-selection`); // Navigate back to package selection
  };

  return (
    <div>
      <h1>Custom Package Details</h1>
      <p>Package ID: {id}</p>
      <button onClick={handleCustomize}>Customize</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
};

export default CustomPackage;
