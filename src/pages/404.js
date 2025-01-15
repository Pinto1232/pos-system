// pages/404.js
import React from 'react';
import Link from 'next/link';

export default function Custom404() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you’re looking for doesn’t exist.</p>
      <Link href="/">
        <a>Go back to the homepage</a>
      </Link>
    </div>
  );
}
