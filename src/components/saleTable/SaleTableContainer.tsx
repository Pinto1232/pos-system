import React from 'react';
import SaleTable from './SaleTable';
import { SaleTableContainerProps } from './types';

const mockData = [
  {
    id: 'INV-2025-0012',
    progress: 75,
    paymentMethod: 'Cash(Visa)',
    items: {
      count: 3,
      name: 'Bread',
      quantity: 2,
    },
    cashier: 'Martha John',
    dateTime: '2025-03-24 14:30',
  },
  {
    id: 'INV-2025-0002',
    progress: 45,
    paymentMethod: 'Cash',
    items: {
      count: 13,
      name: 'Juice',
      quantity: 2,
    },
    cashier: 'Nunes Andrew',
    dateTime: '2025-03-24 14:30',
  },
  {
    id: 'INV-2024-0412',
    progress: 60,
    paymentMethod: 'Cash',
    items: {
      count: 13,
      name: 'Avo',
      quantity: 2,
    },
    cashier: 'Will Smith',
    dateTime: '2025-03-24 14:30',
  },
  {
    id: 'INV-2025-0018',
    progress: 85,
    paymentMethod: 'Card(Visa)',
    items: {
      count: 3,
      name: 'Mongo',
      quantity: 2,
    },
    cashier: 'Lander Gomes',
    dateTime: '2025-03-24 14:30',
  },
];

const SaleTableContainer: React.FC<SaleTableContainerProps> = ({
  className,
}) => {
  const handleViewDetails = (id: string) => {
    console.log('View details for:', id);
  };

  const handleViewReceipt = (id: string) => {
    console.log('View receipt for:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete:', id);
  };

  return (
    <SaleTable
      sales={mockData}
      onViewDetails={handleViewDetails}
      onViewReceipt={handleViewReceipt}
      onDelete={handleDelete}
      className={className}
    />
  );
};

export default SaleTableContainer;
