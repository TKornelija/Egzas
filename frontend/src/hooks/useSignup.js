import { useState } from "react";
import { getUser, login, notifyAuth } from "../lib/auth";

export function useSignup() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const signup = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!email || !password) {
        throw new Error("Missing email or password");
      }

    
      const newUser = { email, name: email.split("@")[0] };
      localStorage.setItem("user", JSON.stringify(newUser));
      notifyAuth();

      
      setIsLoading(false);
      return { user: newUser };
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "Signup failed");
      setIsLoading(false);
      return { error: err.message };
    }
  };

  return { signup, isLoading, error };
}