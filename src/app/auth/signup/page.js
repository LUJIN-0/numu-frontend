'use client'

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useState } from "react";
import Image from "next/image";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

// Validation Schema
const schema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]+$/, "Phone must be numeric")
    .min(9, "Phone number is too short")
    .required("Phone number is required"),
  password: Yup.string()
    .min(9, "Must be at least 9 characters long")
    .matches(/[0-9]/, "Must contain at least one number")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[%$#@*&]/, "Must contain at least one special character (%$#@*&)")
    .required("Password is required"),
});

export default function SignupPage() {
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
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
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Signup failed");

      alert("Signup successful!");
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
      {/* Left Side - Form */}
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

        <div className=" p-8 w-full max-w-md">
          <h1 className="text-xl font-semibold text-center text-gray-800 mb-8">
            Create an Account
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username Feild */}
            <div>
              <label className="block text-gray-700 text-sm mb-1">Username</label>
              <input
                type="text"
                {...register("username")}
                className={`w-full border ${
                  errors.username ? "border-red-500" : "border-gray-300"
                } rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-600`}
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
              )}
            </div>

            {/* First + Last Name Feilds */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 text-sm mb-1">First Name</label>
                <input
                  type="text"
                  {...register("first_name")}
                  className={`w-full border ${
                    errors.first_name ? "border-red-500" : "border-gray-300"
                  } rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-600`}
                />
                {errors.first_name && (
                  <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-1">Last Name</label>
                <input
                  type="text"
                  {...register("last_name")}
                  className={`w-full border ${
                    errors.last_name ? "border-red-500" : "border-gray-300"
                  } rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-600`}
                />
                {errors.last_name && (
                  <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            {/* Email Feild */}
            <div>
              <label className="block text-gray-700 text-sm mb-1">Email</label>
              <input
                type="email"
                {...register("email")}
                className={`w-full border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-600`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Phone Feild */}
            <div>
              <label className="block text-gray-700 text-sm mb-1">Phone Number</label>
              <input
                type="text"
                {...register("phone")}
                className={`w-full border ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                } rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-600`}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
              )}
            </div>

            {/* Password Feild + Info Icon */}
            <div className="relative">
              <label className=" text-gray-700 text-sm mb-1 flex items-center gap-1">
                Password
                <InformationCircleIcon
                  className="h-4 w-4 text-gray-400 cursor-pointer"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                />
              </label>

              <input
                type="password"
                {...register("password")}
                className={`w-full border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-600`}
              />

              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}

              {showTooltip && (
                <div className="absolute right-0 top-0 mt-6 w-64 bg-gray-800 text-white text-xs rounded-md shadow-lg p-3 z-10">
                  <p>Password must include:</p>
                  <ul className="list-disc list-inside space-y-0.5 mt-1">
                    <li>At least 9 characters</li>
                    <li>At least one number</li>
                    <li>At least one lowercase letter</li>
                    <li>At least one uppercase letter</li>
                    <li>At least one special character (%, $, #, @, *, &)</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Server error */}
            {serverError && (
              <p className="text-red-500 text-sm text-center">{serverError}</p>
            )}

            {/* Form Submition */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-medium py-2 rounded-md transition disabled:opacity-60"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-4">
            Already have an account?{" "}
            <a href="/auth/login" className="text-green-700 font-medium hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>

      {/* Right Side - Image (picture yet to be decided) */}
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
