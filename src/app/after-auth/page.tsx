"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiClient  } from "@/api/axiosClient"; 
const AfterAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const exchangeCodeForToken = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get("code");
      const error = searchParams.get("error");

      if (error) {
        console.error("Authentication error:", error);
        router.replace("/");
        return;
      }

      if (code) {
        try {
          const response = await apiClient .post("/auth/keycloak/callback", { code });
          const { accessToken } = response.data;
          localStorage.setItem("accessToken", accessToken);
          router.replace("/dashboard");
        } catch (err) {
          console.error("Failed to exchange code for token:", err);
          router.replace("/");
        }
      } else {
        router.replace("/");
      }
    };

    exchangeCodeForToken();
  }, [router]);

  return <div>Processing authentication, please wait...</div>;
};

export default AfterAuth;
