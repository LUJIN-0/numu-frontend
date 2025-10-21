"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity duration-500">
      {/* Logo */}
      <div className="relative w-28 h-28 flex items-center justify-center">
        <Image
          src="/logo.png"
          alt="NUMU Logo"
          fill
          className="object-contain"
          priority
        />
      </div>

      <p className="text-gray-500 text-md">A Smart Greenhouse System</p>

      {/* Animated progress bar */}
      <div className="mt-4 h-1.5 w-32 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full w-1/3 bg-green-900 animate-[progress_1.5s_ease-in-out_infinite]" />
      </div>

      <style jsx>{`
        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(50%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
