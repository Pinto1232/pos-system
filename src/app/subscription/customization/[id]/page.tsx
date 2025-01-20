"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";

const Customization = () => {
  const params = useParams(); 
  const router = useRouter(); 
  const id = params?.id; 

  // Handle the "Proceed to Review" button click
  const handleReview = () => {
    router.push(`/subscription/detail-revision/${id}`);
  };

  // Handle the "Cancel" button click
  const handleCancel = () => {
    router.push(`/subscription/custom-package/${id}`);
  };

  // Render the customization page
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
