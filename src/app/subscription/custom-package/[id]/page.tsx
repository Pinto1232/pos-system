'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import StyledButton from '@/components/ui/button/StyledButton';

type Params = {
  id: string;
};

export default function CustomPackage() {
  const params = useParams() as Params;
  const router = useRouter();

  const { id } = params;

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
        sx={{ backgroundColor: '#1E3A8A', color: 'white', margin: 1 }}
      />
      <StyledButton
        onClick={handleCancel}
        label="Cancel"
        sx={{ backgroundColor: '#ff5555', color: 'white' }}
      />
    </div>
  );
}
