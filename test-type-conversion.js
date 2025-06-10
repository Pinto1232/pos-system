// Test script to verify type conversion logic
const apiResponse = {
  totalItems: 5,
  data: [
    {
      id: 6,
      title: 'Starter Plus',
      type: 'starter_plus',
    },
    {
      id: 7,
      title: 'Growth Pro',
      type: 'growth_pro',
    },
    {
      id: 8,
      title: 'Custom Pro',
      type: 'custom_pro',
    },
    {
      id: 9,
      title: 'Enterprise Elite',
      type: 'enterprise_elite',
    },
    {
      id: 10,
      title: 'Premium Plus',
      type: 'premium_plus',
    },
  ],
};

const expectedTypes = [
  'starter-plus',
  'growth-pro',
  'enterprise-elite',
  'custom-pro',
  'premium-plus',
];

console.log(
  'API Response Types:',
  apiResponse.data.map((p) => p.type)
);
console.log('Expected Types:', expectedTypes);

// Test the conversion logic
const packageTypes = apiResponse.data.map((pkg) => pkg.type);
const hasExpectedTypes = packageTypes.some((type) => {
  const normalizedType = type.toLowerCase().replace(/_/g, '-');
  return expectedTypes.includes(normalizedType);
});

console.log('Has Expected Types:', hasExpectedTypes);

// Test filtering logic
const filteredPackages = apiResponse.data.filter((pkg) => {
  if (!pkg) return false;
  const type = (pkg.type || '').toLowerCase();
  const normalizedType = type.replace(/_/g, '-');
  const matchesType = expectedTypes.includes(normalizedType);

  console.log(
    `Type: ${type} -> Normalized: ${normalizedType} -> Matches: ${matchesType}`
  );
  return matchesType;
});

console.log('Filtered Packages Count:', filteredPackages.length);
console.log(
  'Filtered Package Titles:',
  filteredPackages.map((p) => p.title)
);
