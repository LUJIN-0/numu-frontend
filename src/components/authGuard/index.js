'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "aws-amplify/auth";
import SplashScreen from "../splashScreen";

export default function AuthGuard({ children }) {
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const verifySession = async () => {
      try {
        await getCurrentUser(); // Checks Cognito session
        setIsAuthenticated(true);
      } catch {
        router.replace("/auth/login"); // Redirect to login if not authenticated
      } finally {
        setChecking(false);
      }
    };
    verifySession();
  }, [router]);

  if (checking) {
    return  <SplashScreen />;
  }

  return isAuthenticated ? children : null;
}
