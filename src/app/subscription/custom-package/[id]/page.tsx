"use client"; // Mark the component as a Client Component

import React from "react";
import { useRouter } from "next/navigation"; // Use next/navigation instead of next/router
import StyledButton from "@/components/ui/button/StyledButton";

const CustomPackage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { id } = params; // Access dynamic route parameter

  const handleCustomize = () => {
    router.push(`/subscription/customization/${id}`); // Navigate to customization page
  };

  const handleCancel = () => {
    router.push(`/subscription/package-selection`);
  };

  return (
    <div>
      <h1>Custom Package Details</h1>
      <p>Package ID: {id}</p>
      <StyledButton
        onClick={handleCustomize}
        label="Customize"
        sx={{ backgroundColor: "#1E3A8A", color: "white", margin: 1 }}
      />
      <StyledButton
        onClick={handleCancel}
        label={"Cancel"}
        sx={{ backgroundColor: "#ff5555", color: "white"}}
      />
    </div>
  );
};

export default CustomPackage;
