import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

export function useSignup() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login: contextLogin } = useAuthContext();

  const signup = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!email || !password) {
        throw new Error("Missing email or password");
      }

    
  const newUser = { email, name: email.split("@")[0] };
  // use auth context to store user and persist to localStorage
  contextLogin(newUser);

      
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