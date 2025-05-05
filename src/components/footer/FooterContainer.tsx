'use client';

import React from 'react';
import Footer from './Footer';

const FooterContainer: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: '#111',
        margin: 0,
        padding: 0,
        width: '100%',
        display: 'block',
      }}
    >
      <Footer />
    </div>
  );
};

export default FooterContainer;
