"use client";

import React from "react";
import { useRouter } from "next/router";

const ProductDetail = () => {
  const router = useRouter();
  const { id } = router.query;

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
