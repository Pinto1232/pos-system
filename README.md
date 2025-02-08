POS System - Next.js, Keycloak & .NET Core Backend

This is a Next.js project bootstrapped with create-next-app.

🚀 Project Overview

This project is a POS (Point of Sale) System built using Next.js for the frontend and .NET Core for the backend. Authentication is managed using Keycloak, and API communication is handled with React Query.

🛠️ Tech Stack

Frontend: Next.js (15.1.6), TypeScript, React Query, Material UI

Backend: .NET Core

Authentication: Keycloak

Database: PostgreSQL

Containerization: Docker, Docker Compose

🔧 Getting Started

1️⃣ Clone the Repository

 git clone https://github.com/your-repo/pos-system.git
 cd pos-system

2️⃣ Install Dependencies

npm install
# or
yarn install
# or
pnpm install

3️⃣ Run the Development Server

npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev

Open http://localhost:3000 with your browser to see the result.

You can start editing the page by modifying app/page.tsx. The page auto-updates as you edit the file.

🔑 Authentication Setup (Keycloak)

This project integrates Keycloak for authentication. Ensure Keycloak is running on your machine or inside Docker.

1️⃣ Start Keycloak Locally

 ./kc.bat start-dev --http-port=8282

Admin URL: http://localhost:8282/admin

2️⃣ Verify Authentication Endpoints

Login Page: http://localhost:3000/api/auth/signin

Check Session: http://localhost:3000/api/auth/session

Logout: http://localhost:3000/api/auth/signout

🌍 API Integration with React Query

This project uses React Query for API data fetching and caching.

Fetching Pricing Packages

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/api/apiClient";
import { useSession } from "next-auth/react";

export const usePricingPackages = () => {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["pricingPackages"],
    queryFn: async () => {
      const response = await apiClient.get("/pricingpackages", {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      return response.data.Data;
    },
    enabled: !!session?.accessToken,
    staleTime: 5 * 60 * 1000,
  });
};

API Test Endpoints

Public API: http://localhost:3000/api/pricingpackages/public

Protected API: http://localhost:3000/api/pricingpackages (Requires authentication)

🐳 Running with Docker

This project includes Docker support for local development.

1️⃣ Start the Services

docker-compose up -d --build

2️⃣ Stop the Services

docker-compose down

3️⃣ Docker Compose Configuration

Frontend: Runs on http://localhost:3000

Backend: Runs on http://localhost:5107

Keycloak: Runs on http://localhost:8282

Database (PostgreSQL): Runs on localhost:5432

🚀 Deploy on Vercel

The easiest way to deploy your Next.js app is to use the Vercel Platform from the creators of Next.js.

Check out our Next.js deployment documentation for more details.

📚 Learn More

To learn more about the technologies used in this project, check out the following resources:

Next.js Documentation - Learn about Next.js features and API.

Learn Next.js - An interactive Next.js tutorial.

Keycloak Documentation - Learn how to configure and use Keycloak.

React Query Docs - Learn about React Query for data fetching.

🚀 Enjoy working on your POS system! Let me know if you need further refinements. 🔥

