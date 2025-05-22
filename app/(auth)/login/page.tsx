"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signIn } from "@/actions/auth";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");


        const formData = {

            email,
            password,
        };
        const result = await signIn(formData);

        if (result.status === "success") {
            router.push("/")
        } else {
            setError(result.status)
        }
        setIsLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
                    <p className="text-gray-600 mt-2">Sign in to your account to continue</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

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
                        <div className="flex items-center justify-between mb-1">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <Link href="/forgot-password" className="text-sm text-green-600 hover:text-green-800 transition-colors">
                                Forgot password?
                            </Link>
                        </div>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                            {isLoading ? "Signing in..." : "Sign In"}
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-600">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-green-600 hover:text-green-800 font-medium transition-colors">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
