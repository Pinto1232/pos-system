"use client";
import React, { useState } from "react";
import apiClient from "../apiClient";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await apiClient.post("/auth/login", { username, password });
      sessionStorage.setItem("access_token", response.data.access_token);
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div>
      <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
