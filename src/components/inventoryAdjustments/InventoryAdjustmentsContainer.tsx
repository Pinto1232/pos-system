'use client';

import React from 'react';
import InventoryAdjustments from './InventoryAdjustments';
import { InventoryAdjustmentsProps } from './types';

const InventoryAdjustmentsContainer: React.FC<InventoryAdjustmentsProps> = (
  props
) => {
  return <InventoryAdjustments {...props} />;
};

export default InventoryAdjustmentsContainer;
