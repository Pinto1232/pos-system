'use client';

import React from 'react';
import ProductExpiryTracking from './ProductExpiryTracking';
import { ProductExpiryTrackingProps } from './types';

const ProductExpiryTrackingContainer: React.FC<ProductExpiryTrackingProps> = (
  props
) => {
  return <ProductExpiryTracking {...props} />;
};

export default ProductExpiryTrackingContainer;
