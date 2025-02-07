"use client";
import { usePricingPackages } from "@/hooks/usePricing";

export default function DashboardPage() {
  const { data: packages, isLoading, error } = usePricingPackages();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Failed to fetch data</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Pricing Packages</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {packages?.map((pkg) => (
          <div key={pkg.Id} className="p-4 border rounded-lg shadow">
            <h2 className="text-xl font-semibold">{pkg.Title}</h2>
            <p>{pkg.ExtraDescription}</p>
            <p className="font-bold">Price: ${pkg.Price}</p>
            <p>Trial Period: {pkg.TestPeriodDays} days</p>
          </div>
        ))}
      </div>
    </div>
  );
}
