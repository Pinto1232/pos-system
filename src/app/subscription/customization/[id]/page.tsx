"use client";

import React from "react";
import { useRouter } from "next/router";

const Customization = () => {
  const router = useRouter();
  const { id } = router.query;

  const handleReview = () => {
    router.push(`/subscription/detail-revision/${id}`);
  };

  const handleCancel = () => {
    router.push(`/subscription/custom-package/${id}`);
  };

  return (
    <div>
      <h1>Customization</h1>
      <p>Customizing Package ID: {id}</p>
      <button onClick={handleReview}>Proceed to Review</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
};

export default Customization;
