import { useQuery, UseQueryResult } from '@tanstack/react-query';

export interface PricingPackage {
  descriptionList: string[];
    id: number;
  title: string;
  description: string;
  extraDescription: string;
  icon: string;
  price: number;
  testPeriodDays: number;
}

async function fetchPricingPackages(): Promise<PricingPackage[]> {
  //console.log("API URL in fetchPricingPackages:", process.env.NEXT_PUBLIC_API_URL);
  //console.log("API TOKEN in fetchPricingPackages:", process.env.NEXT_PUBLIC_API_TOKEN);

  if (!process.env.NEXT_PUBLIC_API_URL || !process.env.NEXT_PUBLIC_API_TOKEN) {
    throw new Error("Missing API URL or API token in environment variables");
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/PricingPackages`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
    },
  });

  console.log("Response status:", response.status);
  console.log("Response headers:", response.headers);

  if (!response.ok) {
    throw new Error(`Failed to fetch pricing packages. Status: ${response.status}`);
  }

  return response.json();
}

export function usePricingPackage(): UseQueryResult<PricingPackage[], Error> {
  return useQuery({
    queryKey: ['pricingPackages'],
    queryFn: fetchPricingPackages,
  });
}