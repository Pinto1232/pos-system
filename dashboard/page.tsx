"use client";
import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

// ✅ Define User type
type User = {
  username: string;
  email: string;
  id: number; 
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.get<User>("/users/me", {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("access_token")}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };
    fetchUser();
  }, []);

  return <div>{user ? <h1>Welcome, {user.username}!</h1> : <p>Loading...</p>}</div>;
}
