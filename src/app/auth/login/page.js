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
    <div className="min-h-screen flex bg-gray-50">
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

        <div className="p-8 w-full max-w-md">
          <h1 className="text-xl font-semibold text-center text-gray-800 mb-6">
            Welcome Back
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Username / Email Feild */}
            <div>
              <label className="block text-gray-700 text-sm mb-1">
                Username / Email
              </label>
              <input
                type="text"
                {...register("identifier")}
                className={`w-full border ${
                  errors.identifier ? "border-red-500" : "border-gray-300"
                } rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-600`}
              />
              {errors.identifier && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.identifier.message}
                </p>
              )}
            </div>

            {/* Password Feild */}
            <div>
              <label className="block text-gray-700 text-sm mb-1">Password</label>
              <input
                type="password"
                {...register("password")}
                className={`w-full border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-600`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me + Forgot Password 
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-green-700 focus:ring-green-600"
                />
                Remember Me
              </label>

              <a
                href="/auth/reset-password"
                className="text-sm text-green-700 hover:underline"
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
              className="w-full bg-green-700 hover:bg-green-800 text-white font-medium py-2 rounded-md transition disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Signup Link 
          <p className="text-sm text-gray-500 text-center mt-4">
            Don’t have an account?{" "}
            <a href="/auth/signup" className="text-green-700 font-medium hover:underline">
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
