"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth/useAuth";

const SignupPage = () => {
  const { login, user } = useAuth();

  const handleSignup = () => {
    login("newUser");
  };

  return (
    <div>
      <h1>Signup Page</h1>
      <p>Current User: {user || "No user logged in"}</p>
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
};

export default SignupPage;
