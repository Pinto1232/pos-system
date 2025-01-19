"use client";

import React from "react";
import { useParams } from "next/navigation";

const EnterprisePackage = () => {
  const params = useParams();
  const id = params?.id as string; // Safely access and typecast `id` to string

  if (!id) {
    return <p>Invalid package ID.</p>; // Handle the case when `id` is not provided
  }

  return (
    <div>
      <h1>Enterprise Package</h1>
      <p>This is the Enterprise Package with ID: {id}</p>
      {/* Add specific details about the Enterprise Package */}
    </div>
  );
};

export default EnterprisePackage;
