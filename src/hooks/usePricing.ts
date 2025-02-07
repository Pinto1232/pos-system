import { useQuery } from "@tanstack/react-query";
import apiClient from "@/app/api/apiClient";
import { useSession } from "next-auth/react";
import { Session } from "next-auth"; // Import Session type

// ✅ Define PricingPackage Type
export type PricingPackage = {
  Id: number;
  Title: string;
  Description: string;
  ExtraDescription: string;
  Price: number;
  TestPeriodDays: number;
};

export const usePricingPackages = () => {
    const { data: session } = useSession();
  
    return useQuery<PricingPackage[]>({
      queryKey: ["pricingPackages"],
      queryFn: async () => {
        const sessionTyped = session as Session & { accessToken: string };
        const response = await apiClient.get("/pricingpackages?page=1&pageSize=5", {
          headers: { Authorization: `Bearer ${sessionTyped.accessToken}` },
        });
        return response.data.Data;
      },
      enabled: !!session?.accessToken, // Fetch only when authenticated
      staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    });
  };
  
