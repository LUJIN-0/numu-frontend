'use client'

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import Image from "next/image";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
});

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Should be changed with the actual API endpoint
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) setSuccess(true);
      else alert("Email not found or error sending link.");
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen  bg-gray-50">
      <div className="flex flex-col justify-center w-full max-w-md p-10 mx-auto">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo2.png"
            alt="NUMU Logo"
            width={45}
            height={45}
            className="object-contain"
          />
        </div>

        <h2 className="text-xl font-semibold mb-1 text-center text-gray-800">Reset Password</h2>
        <p className="text-gray-500 mb-8 text-center text-sm">
          Enter your email to receive a password reset link
        </p>

        {success ? (
          <div className="text-center text-green-700">
            Password reset link sent successfully!
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                className="w-full border rounded-md px-3 py-2 focus:ring-1 focus:ring-green-600 focus:outline-none"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-800 text-white py-2 rounded-lg hover:bg-green-900 transition"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-600 mt-6">
          Remember your password?{" "}
          <a href="/auth/login" className="text-green-700 hover:underline">
            Login
          </a>
        </p>
      </div>

      <div className="hidden md:block w-1/2 bg-gray-50 relative">
        <Image
          src="/greenhouse.jpg"
          alt="Garden"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}
