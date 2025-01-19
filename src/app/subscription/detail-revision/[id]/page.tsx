"use client";


import React from "react";
import { useRouter } from "next/router";
import StyledButton from "@/components/ui/button/StyledButton";

const DetailRevision = () => {
  const router = useRouter();
  const { id } = router.query;

  const handleConfirm = () => {
    router.push(`/subscription/product-detail/${id}`);
  };

  const handleBack = () => {
    router.push(`/subscription/package-selection`);
  };

  return (
    <div>
      <h1>Detail Revision</h1>
      <p>Reviewing Package ID: {id}</p>
      <StyledButton onClick={handleConfirm} label={""}>Confirm</StyledButton>
      <StyledButton onClick={handleBack} label={""}>Back</StyledButton>
    </div>
  );
};

export default DetailRevision;
