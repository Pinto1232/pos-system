"use client";

import React from "react";
import { useRouter } from "next/navigation";
import StyledButton from "@/components/ui/button/StyledButton";

export default function CustomPackage() {
  const router = useRouter();

  // @ts-expect-error: router.query is not typed
  const { id } = router.query; // Suppress the TypeScript error temporarily

  const handleCustomize = () => {
    router.push(`/subscription/customization/${id}`);
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
        label="Cancel"
        sx={{ backgroundColor: "#ff5555", color: "white" }}
      />
    </div>
  );
}
