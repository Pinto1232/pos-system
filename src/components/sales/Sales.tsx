'use client';
import React from 'react';
import { SalesProps } from './types';
import SalesContainer from './containers/SalesContainer';

const Sales: React.FC<SalesProps> = (props) => {
  return <SalesContainer {...props} />;
};

export default Sales;
