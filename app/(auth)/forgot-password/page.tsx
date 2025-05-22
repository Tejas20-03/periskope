"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Replace with your actual password reset logic
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to send reset link. Please try again.");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Forgot Password</h1>
          <p className="text-gray-600 mt-2">Enter your email to receive a password reset link</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center">
            <div className="mb-4 p-4 bg-green-100 border border-green-200 text-green-700 rounded-lg">
              <p>Password reset link has been sent to your email.</p>
              <p className="mt-2">Please check your inbox and follow the instructions.</p>
            </div>
            <Link href="/login" className="text-green-600 hover:text-green-800 font-medium transition-colors">
              Return to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </div>

            <div className="text-center mt-4">
              <Link href="/login" className="text-green-600 hover:text-green-800 font-medium transition-colors">
                Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
