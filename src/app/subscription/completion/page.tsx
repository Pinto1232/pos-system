"use client"; // Mark this component as a Client Component

import React from "react";
import { useRouter } from "next/navigation"; // Use next/navigation

const Completion = () => {
  const router = useRouter(); // Hook now works because of "use client"

  const handleGoBack = () => {
    router.push("/subscription/package-selection"); // Navigate back to package selection
  };

  return (
    <div>
      <h1>Subscription Complete</h1>
      <p>Thank you for subscribing!</p>
      <button onClick={handleGoBack}>Go Back to Package Selection</button>
    </div>
  );
};

export default Completion;
