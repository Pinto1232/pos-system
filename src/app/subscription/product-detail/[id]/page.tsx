"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";

const ProductDetail = () => {
  const params = useParams(); // Retrieve dynamic route parameters
  const router = useRouter(); // Use Next.js navigation hook
  const id = params?.id; // Safely get the "id" parameter

  // Handle the "Finalize" button click
  const handleFinalize = () => {
    router.push(`/subscription/completion`);
  };

  return (
    <div>
      <h1>Product Detail</h1>
      <p>Product for Package ID: {id}</p>
      <button onClick={handleFinalize}>Finalize</button>
    </div>
  );
};

export default ProductDetail;
