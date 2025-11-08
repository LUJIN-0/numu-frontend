'use client'

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import { useTranslations } from 'next-intl';
import { useAuth } from "@/context/AuthContext";

// Validation Schema
export default function LoginPage() {
  const t = useTranslations('Login');

  const schema = Yup.object().shape({
    identifier: Yup.string().required(t('email-required')),
    password: Yup.string().required(t('password-required')),
  });

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  // Automatically redirect if already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          console.log("Already logged in:", user);
          router.replace("/dashboard");
        }
      } catch {
        // if no session, stay on login page
      }
    };
    checkSession();
  }, [router]);

  // Sign-in logic using AWS Cognito (SRP flow)
  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);

    try {
      const { isSignedIn, nextStep } = await signIn({
        username: data.identifier,
        password: data.password,
      });

      if (isSignedIn) {
        console.log("✅ Cognito login successful");

        // Fetch tokens if needed
        const session = await fetchAuthSession();
        const accessToken = session.tokens?.accessToken?.toString();
        if (accessToken) localStorage.setItem("access_token", accessToken);

        // Update AuthContext user
        const email = data.identifier;
        const name = email.includes("@") ? email.split("@")[0] : email;
        setUser({ name });

        router.push("/dashboard");
        reset();
      } else {
        console.warn("Login flow not completed:", nextStep);
        setServerError(t('extra_verification'));
      }
    } catch (err) {
      console.error("❌ Cognito login error:", err);
      setServerError(err.message || t('login_failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex transition-colors duration-300 bg-background text-(--card-text)">
      {/* Left - Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-10">
        {/* Logo */}
        <div>
          <Image
            src="/logo2.png"
            alt="NUMU Logo"
            width={45}
            height={45}
            className="object-contain mx-auto"
          />
        </div>

        <div className="p-8 w-full max-w-md transition-colors duration-300">
          <h1 className="text-xl font-semibold text-center mb-6 transition-colors duration-300 text-(--card-text)">
            {t('welcome')}
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm mb-1 transition-colors duration-300 text-(--muted-text)">
                {t('email')}
              </label>
              <input
                type="text"
                {...register("identifier")}
                className={`w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-700 transition-colors duration-300 ${errors.identifier ? "border-red-500" : ""}`}
                style={{
                  backgroundColor: "var(--header-input-bg)",
                  borderColor: errors.identifier ? "#ef4444" : "var(--border-color)",
                  color: "var(--card-text)",
                }}
              />
              {errors.identifier && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.identifier.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm mb-1 transition-colors duration-300 text-(--muted-text)">
                {t('password')}
              </label>
              <input
                type="password"
                {...register("password")}
                className={`w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-700 transition-colors duration-300 ${errors.password ? "border-red-500" : ""}`}
                style={{
                  backgroundColor: "var(--header-input-bg)",
                  borderColor: errors.password ? "#ef4444" : "var(--border-color)",
                  color: "var(--card-text)",
                }}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
              {/* Forgot Password Link 
              <div className="text-right mt-1">
                <Link
                  href="/auth/reset-password"
                  className="text-sm text-green-700 hover:underline"
                >
                  {t('forgot_password')}
                </Link>
              </div>
              */}
            </div>

            {/* Server Error */}
            {serverError && (
              <p className="text-red-500 text-sm text-center">{serverError}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full font-medium py-2 rounded-md transition disabled:opacity-60"
              style={{
                backgroundColor: "var(--sidebar-bg)",
                color: "#fff",
                border: "1px solid var(--border-color)",
              }}
            >
              {loading ? t('loading') : t('login')}
            </button>
          </form>
        </div>
      </div>

      {/* Right - Image */}
      <div className="hidden md:block w-1/2 relative">
        <Image
          src="/greenhouse.jpg"
          alt="Greenhouse Garden"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
