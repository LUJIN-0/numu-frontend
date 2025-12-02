'use client'

import { useAuth } from "@/context/AuthContext";
import SplashScreen from "@/components/splashScreen";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Layout from "@/layout/Layout";

export default function AlertsLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/auth/login");
  }, [loading, user, router]);

  if (loading) return <SplashScreen />;

  return user ? <Layout>{children}</Layout> : null;
}
