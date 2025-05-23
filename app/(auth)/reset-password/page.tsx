"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

// Create a component that uses useSearchParams
function ResetPasswordContent() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [tokenValid, setTokenValid] = useState(true);

    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    useEffect(() => {
        // Validate token on component mount
        if (!token) {
            setTokenValid(false);
            setError("Invalid or missing reset token");
            return;
        }

        const validateToken = async () => {
            try {
                // Replace with your actual token validation logic
                const response = await fetch(`/api/auth/validate-reset-token?token=${token}`);
                if (!response.ok) {
                    setTokenValid(false);
                    setError("This password reset link is invalid or has expired");
                }
            } catch (err) {
                setTokenValid(false);
                setError("Failed to validate reset token");
            }
        };

        validateToken();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long");
            setIsLoading(false);
            return;
        }

        try {
            // Replace with your actual password reset logic
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            if (!response.ok) {
                throw new Error("Failed to reset password. Please try again.");
            }

            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    if (!tokenValid) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white p-4">
                <div className="w-full max-w-md text-center">
                    <div className="mb-6">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Invalid Reset Link</h1>
                        <p className="text-gray-600">{error}</p>
                    </div>
                    <Link href="/forgot-password" className="text-green-600 hover:text-green-800 font-medium transition-colors">
                        Request a new password reset link
                    </Link>
                </div>
            </div>
        );
    }

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
                    <h1 className="text-3xl font-bold text-gray-800">Reset Your Password</h1>
                    <p className="text-gray-600 mt-2">Enter your new password below</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {success ? (
                    <div className="text-center">
                        <div className="mb-4 p-4 bg-green-100 border border-green-200 text-green-700 rounded-lg">
                            <p>Your password has been successfully reset!</p>
                        </div>
                        <Link href="/login" className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition-colors">
                            Sign in with new password
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                New Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500 transition-colors"
                                placeholder="••••••••"
                            />
                            <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm New Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500 transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                            >
                                {isLoading ? "Resetting Password..." : "Reset Password"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

// Loading fallback component
function LoadingFallback() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4">
            <div className="w-full max-w-md text-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-300 rounded-full mb-4"></div>
                    <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
                    <div className="h-12 bg-gray-300 rounded w-full"></div>
                </div>
            </div>
        </div>
    );
}

// Main component with Suspense boundary
export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <ResetPasswordContent />
        </Suspense>
    );
}
