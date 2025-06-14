import React from 'react';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';

export const renderProductImage = (
  imageSrc: string | undefined,
  productName: string,
  width: number,
  height: number
) => {
  console.log(
    'ProductTable - Rendering image for product:',
    productName,
    'Image source:',
    JSON.stringify(imageSrc ? 'Image exists' : 'No image', null, 2)
  );

  if (imageSrc) {
    try {
      return (
        <Image
          src={imageSrc}
          alt={`${productName} product image`}
          width={width}
          height={height}
          style={{
            objectFit: 'cover',
            display: 'block',
            visibility: 'visible',
            opacity: 1,
          }}
          priority
        />
      );
    } catch (error) {
      console.error(
        'ProductTable - Error rendering image:',
        JSON.stringify(error, null, 2)
      );
      return (
        <Box
          sx={{
            width,
            height,
            bgcolor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption">Image Error</Typography>
        </Box>
      );
    }
  } else {
    return (
      <Box
        sx={{
          width,
          height,
          bgcolor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption">No Image</Typography>
      </Box>
    );
  }
};
