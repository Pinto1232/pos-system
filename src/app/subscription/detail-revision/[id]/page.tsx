"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import StyledButton from "@/components/ui/button/StyledButton";

const DetailRevision = () => {
  const params = useParams(); // Get dynamic route parameters
  const router = useRouter(); // Use the Next.js App Router's navigation hook
  const id = params?.id; // Safely get the "id" parameter

  // Handle the "Confirm" button click
  const handleConfirm = () => {
    router.push(`/subscription/product-detail/${id}`);
  };

  // Handle the "Back" button click
  const handleBack = () => {
    router.push(`/subscription/package-selection`);
  };

  return (
    <div>
      <h1>Detail Revision</h1>
      <p>Reviewing Package ID: {id}</p>
      <StyledButton onClick={handleConfirm} label="Confirm">Confirm</StyledButton>
      <StyledButton onClick={handleBack} label="Back">Back</StyledButton>
    </div>
  );
};

export default DetailRevision;
