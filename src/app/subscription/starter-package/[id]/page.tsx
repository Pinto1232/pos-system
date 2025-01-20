'use client'; // Ensure this component is treated as a Client Component

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

const StartPackage = () => {
  const router = useRouter();
  const params = useParams();
  const [showDetails, setShowDetails] = useState(false);

  // Dummy API data
  const packageDetails = {
    id: '1',
    title: 'Starter',
    icon: '/starter-icon.png', // Replace with the actual icon path
    price: 29.99,
    testPeriodDays: 14,
    extraDescription: 'This package is perfect for startups and small businesses.',
    descriptionList: [
      'Select the essential modules and features for your business.',
      'Ideal for small businesses or those new to POS systems.',
    ],
  };

  // Check if `id` is provided
  if (!params?.id) {
    return <p className="text-red-500 text-center mt-10">Error: Product ID is missing.</p>;
  }

  const handleFinalize = () => {
    router.push('/subscription/completion'); // Redirect to the payment or completion page
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      {/* Card Wrapper */}
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-6">
        {/* Header Section */}
        <header className="flex items-center space-x-4">
          <img
            src={packageDetails.icon}
            alt={`${packageDetails.title} Icon`}
            className="w-16 h-16"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{packageDetails.title} Package</h1>
            <p className="text-lg text-blue-500 font-semibold">
              Only ${packageDetails.price.toFixed(2)}/month - {packageDetails.testPeriodDays}-day free trial!
            </p>
          </div>
        </header>

        {/* Package Details */}
        <div className="mt-6">
          <p className="text-gray-600">{packageDetails.extraDescription}</p>
          <h3 className="mt-4 text-lg font-semibold text-gray-800">Features:</h3>
          <ul className="mt-2 space-y-2 list-disc list-inside text-gray-700">
            {packageDetails.descriptionList.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="mt-4 text-blue-500 hover:underline"
          >
            {showDetails ? 'Hide Details' : 'View More Details'}
          </button>
          {showDetails && (
            <p className="mt-2 text-sm text-gray-600">
              Additional information about the package will be displayed here.
            </p>
          )}
        </div>

        {/* Call-to-Action */}
        <button
          onClick={handleFinalize}
          className="mt-8 w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg text-lg font-medium transition"
        >
          Start 14-Day Free Trial
        </button>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-100 rounded-lg shadow-md max-w-md w-full p-4 mt-8 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Have Questions?</h3>
        <div className="space-y-2">
          <div>
            <h4 className="font-medium text-gray-700">Can I cancel my subscription anytime?</h4>
            <p className="text-sm text-gray-500">
              Yes, you can cancel your subscription at any time without any penalties.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700">What happens after the trial ends?</h4>
            <p className="text-sm text-gray-500">
              You will be charged ${packageDetails.price.toFixed(2)} per month after the trial ends.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-6 text-center text-gray-500 text-sm">
        By subscribing, you agree to our{' '}
        <a href="/terms" className="text-blue-500 hover:underline">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="/privacy" className="text-blue-500 hover:underline">
          Privacy Policy
        </a>.
      </footer>
    </div>
  );
};

export default StartPackage;
