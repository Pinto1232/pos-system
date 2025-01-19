"use client"; // Ensure this component is treated as a Client Component

import React from "react";
import { useRouter } from "next/navigation";

const ProductDetail = ({ params }: { params: { id?: string } }) => {
  const router = useRouter(); // Use useRouter for navigation

  // Check if `id` is provided
  if (!params?.id) {
    return <p>Error: Product ID is missing.</p>;
  }

  const { id } = params; // Get the dynamic route parameter
  console.log("Params:", params);

  const handleFinalize = () => {
    router.push("/subscription/completion"); // Redirect to the completion page
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
