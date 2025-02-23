"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosClient from "@/api/axiosClient"; // Ensure this is set up to call your backend

const AfterAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const exchangeCodeForToken = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const error = params.get("error");

      if (error) {
        console.error("Authentication error:", error);
        router.replace("/");
        return;
      }

      if (code) {
        try {
          // Call your backend endpoint to exchange the code for an access token.
          // Your backend should use the code to get tokens from Keycloak.
          const response = await axiosClient.post("/auth/keycloak/callback", { code });
          const { accessToken } = response.data;
          // Store the access token (or session info) for later API calls.
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
