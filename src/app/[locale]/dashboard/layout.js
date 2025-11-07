'use client'

import { useAuth } from "@/context/AuthContext";
import SplashScreen from "@/components/splashScreen";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Layout from "@/layout/Layout";

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect to login if no user and not loading
  useEffect(() => {
    if (!loading && !user) router.replace("/auth/login");
  }, [loading, user, router]);

  // Show splash screen while checking
  if (loading) return <SplashScreen />;

  // Wrap all dashboard pages with your main Layout
  return user ? <Layout>{children}</Layout> : null;
}
