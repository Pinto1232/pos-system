'use client';

import React from 'react';
import styles from './SalesContainer.module.css';

const SalesContainer: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Sales Overview</h2>
      </div>
      <div className={styles.content}>
        {/* Sales content will go here */}
        <p>Sales dashboard content coming soon...</p>
      </div>
    </div>
  );
};

export default SalesContainer; 