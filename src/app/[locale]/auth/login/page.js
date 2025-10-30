'use client'

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Validation Schema
const schema = Yup.object().shape({
  identifier: Yup.string().required("Username or Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function LoginPage() {
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);

    try {
      // Should be changed with the actual API endpoint
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Login failed");

      alert("Login successful!");
      router.push("/dashboard");
      reset();
    } catch (err) {
      setServerError(err.message);
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
          <h1 className="text-xl font-semibold text-center mb-6 transition-colors duration-300 text-(--card-text)">Welcome Back</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Username / Email Feild */}
            <div>
              <label className="block text-sm mb-1 transition-colors duration-300 text-(--muted-text)">Username / Email</label>
              <input
                type="text"
                {...register("identifier")}
                className={`w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-700 transition-colors duration-300 ${
                  errors.identifier ? "border-red-500" : ""
                }`}
                style={{
                  backgroundColor: "var(--header-input-bg)",
                  borderColor: errors.identifier
                    ? "#ef4444"
                    : "var(--border-color)",
                  color: "var(--card-text)",
                }}
              />
              {errors.identifier && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.identifier.message}
                </p>
              )}
            </div>

            {/* Password Feild */}
            <div>
              <label className="block text-sm mb-1 transition-colors duration-300 text-(--muted-text)">Password</label>
              <input
                type="password"
                {...register("password")}
                className={`w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-700 transition-colors duration-300 ${
                  errors.password ? "border-red-500" : ""
                }`}
                style={{
                  backgroundColor: "var(--header-input-bg)",
                  borderColor: errors.password
                    ? "#ef4444"
                    : "var(--border-color)",
                  color: "var(--card-text)",
                }}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me + Forgot Password 
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-(--muted-text)">
                <input
                  type="checkbox" 
                  className="rounded border text-green-700 focus:ring-green-600 border-(--border-color)"/>
                Remember Me
              </label>

              <a
                href="/auth/reset-password"
                className="text-sm hover:underline" style={{ color: "var(--chart-fill)" }}
              >
                Forgot Password?
              </a>
            </div>*/}

            {/* Server Error */}
            {serverError && (
              <p className="text-red-500 text-sm text-center">{serverError}</p>
            )}

            {/* Form Submittion */}
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
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Signup Link 
          <p className="text-sm text-center mt-4 text-(--muted-text)">Don’t have an account?{" "}
            <a
              href="/auth/signup"
              className="font-medium hover:underline"
              style={{ color: "var(--chart-fill)" }}
            >
              Sign up
            </a>
          </p>*/}
        </div>
      </div>

      {/* Right - Image (picture yet to be decided) */}
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
