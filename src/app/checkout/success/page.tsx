import { Suspense } from 'react';
import { Button } from '@mui/material';
import Link from 'next/link';

function SuccessContent() {
  return (
    <div className="max-w-2xl mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">
        Payment Successful! 🎉
      </h1>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        href="/dashboard"
      >
        Return to Dashboard
      </Button>
    </div>
  );
}
export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
