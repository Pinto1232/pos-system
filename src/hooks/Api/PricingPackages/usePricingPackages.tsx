import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useKeycloak } from "@react-keycloak/web";
import { PricingPackage } from "@/types/types";

export function usePricingPackage(): UseQueryResult<PricingPackage[], Error> {
  const { keycloak, initialized } = useKeycloak();

  return useQuery({
    queryKey: ["pricingPackages"],
    queryFn: async () => {
      try {
        // Force token update before making the request
        const freshToken = await keycloak.updateToken(30);
        if (!freshToken || !keycloak.token) {
          throw new Error("Token refresh failed");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/PricingPackages`,
          {
            headers: {
              Authorization: `Bearer ${keycloak.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 401) {
          keycloak.logout({ redirectUri: window.location.origin });
          throw new Error("Session expired - redirecting to login");
        }

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
      } catch (error) {
        console.error("Fetch error:", error);
        throw error;
      }
    },
    enabled: initialized && keycloak.authenticated,
    retry: (failureCount, error) => {
      if (error.message.includes("401")) return false;
      return failureCount < 3;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false
  });
}