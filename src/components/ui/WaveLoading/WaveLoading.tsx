'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaCog } from 'react-icons/fa';
import styles from './WaveLoading.module.css';

const WaveLoading: React.FC = () => {
  return (
    <motion.div
      className={styles.loading}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div>Loading package configuration...</div>
      <FaCog className={styles.loadingIcon} />
    </motion.div>
  );
};

export default WaveLoading;
