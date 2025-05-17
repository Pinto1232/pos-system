import React from 'react';
import TransactionsTable from './TransactionsTable';

const TransactionsContainer = () => {
  const transactions = [
    {
      id: 'INV-2025-0012',
      paymentMethod: 'Cash(Visa)',
      items: '3 items (Bread x2)',
      cashier: 'Martha John',
      date: '2025-03-24 14:30',
    },
    {
      id: 'INV-2025-0002',
      paymentMethod: 'Cash',
      items: '13 items (Juice x2)',
      cashier: 'Nunes Andrew',
      date: '2025-03-24 14:30',
    },
    {
      id: 'INV-2025-00022',
      paymentMethod: 'Cash',
      items: '13 items (Juice x2)',
      cashier: 'Nunes Andrew',
      date: '2025-03-24 14:30',
    },
    {
      id: 'INV-2025-00023',
      paymentMethod: 'Cash',
      items: '13 items (Juice x2)',
      cashier: 'Nunes Andrew',
      date: '2025-03-24 14:30',
    },
  ];

  return <TransactionsTable transactions={transactions} />;
};

export default TransactionsContainer;
