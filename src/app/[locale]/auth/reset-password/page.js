'use client'

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import Image from "next/image";
import { resetPassword, confirmResetPassword } from "aws-amplify/auth";
import Link from "next/link";

// Validation Schemas
const emailSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
});

const confirmSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  code: yup.string().required("Verification code is required"),
  newPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),
});

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("request");
  const [email, setEmail] = useState("");

  const schema = step === "request" ? emailSchema : confirmSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  // Send password reset code
  const handleRequest = async (data) => {
    setLoading(true);
    try {
      const { nextStep } = await resetPassword({ username: data.email });
      console.log("Reset initiated:", nextStep);
      setEmail(data.email);
      setStep("confirm");
    } catch (err) {
      console.error("Reset request error:", err);
      alert(err.message || "Error sending reset code.");
    } finally {
      setLoading(false);
    }
  };

  // Confirm new password with verification code
  const handleConfirm = async (data) => {
    setLoading(true);
    try {
      await confirmResetPassword({
        username: data.email,
        confirmationCode: data.code,
        newPassword: data.newPassword,
      });
      alert("Password reset successfully! You can now log in.");
      window.location.href = "/auth/login";
    } catch (err) {
      console.error("Confirm reset error:", err);
      alert(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = step === "request" ? handleRequest : handleConfirm;

  return (
    <div className="flex h-screen bg-gray-50">
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

        <h2 className="text-xl font-semibold mb-1 text-center text-gray-800">
          {step === "request" ? "Reset Password" : "Enter New Password"}
        </h2>
        <p className="text-gray-500 mb-8 text-center text-sm">
          {step === "request"
            ? "Enter your email to receive a password reset code"
            : "Check your email for a code and set a new password"}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              defaultValue={email}
              readOnly={step === "confirm"} // keep email fixed after sending code
              className={`w-full border rounded-md px-3 py-2 focus:ring-1 focus:ring-green-600 focus:outline-none ${
                step === "confirm" ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Show verification + new password fields only after code is sent */}
          {step === "confirm" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Code
                </label>
                <input
                  type="text"
                  {...register("code")}
                  className="w-full border rounded-md px-3 py-2 focus:ring-1 focus:ring-green-600 focus:outline-none"
                  placeholder="Enter the code sent to your email"
                />
                {errors.code && (
                  <p className="text-sm text-red-500 mt-1">{errors.code.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  {...register("newPassword")}
                  className="w-full border rounded-md px-3 py-2 focus:ring-1 focus:ring-green-600 focus:outline-none"
                  placeholder="Enter new password"
                />
                {errors.newPassword && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-800 text-white py-2 rounded-lg hover:bg-green-900 transition disabled:opacity-60"
          >
            {loading
              ? "Processing..."
              : step === "request"
              ? "Send Reset Code"
              : "Confirm New Password"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Remember your password?{" "}
          <Link href="/auth/login" className="text-green-700 hover:underline">
            Login
          </Link>
        </p>
      </div>

      <div className="hidden md:block w-1/2 bg-gray-50 relative">
        <Image src="/greenhouse.jpg" alt="Garden" fill className="object-cover" />
      </div>
    </div>
  );
}
