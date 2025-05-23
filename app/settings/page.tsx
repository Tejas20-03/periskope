"use client";

import { useState, useEffect, useRef } from "react";
import { getCurrentUser } from "@/actions/user";
import { createClient } from "@/utils/supabase/client";
import { User } from "@/types";
import Image from "next/image";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    phone_number: "",
    status: "",
  });

  useEffect(() => {
    async function loadUser() {
      setLoading(true);
      const { user, error } = await getCurrentUser();
      if (error) {
        toast.error(error);
      } else if (user) {
        setUser(user);
        setFormData({
          username: user.username || "",
          phone_number: user.phone_number || "",
          status: user.status || "",
        });
        if (user.avatar_url) {
          setAvatarPreview(user.avatar_url);
        }
      }
      setLoading(false);
    }

    loadUser();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const supabase = createClient();

      // Update profile data
      const { error: updateError } = await supabase
        .from("user_profiles")
        .update({
          username: formData.username,
          phone_number: formData.phone_number,
          status: formData.status,
        })
        .eq("email", user?.email);

      if (updateError) {
        throw new Error(updateError.message);
      }

      // Upload avatar if changed
      if (avatar) {
        const fileName = `avatar-${user?.id}-${Date.now()}`;
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, avatar);

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName);

        // Update avatar URL in profile
        const { error: avatarUpdateError } = await supabase
          .from("user_profiles")
          .update({
            avatar_url: urlData.publicUrl,
          })
          .eq("email", user?.email);

        if (avatarUpdateError) {
          throw new Error(avatarUpdateError.message);
        }
      }

      toast.success("Profile updated successfully");

      // Refresh user data
      const { user: updatedUser } = await getCurrentUser();
      if (updatedUser) {
        setUser(updatedUser);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-center relative">
          <button
            onClick={() => router.push("/")}
            className="absolute left-4 top-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-all"
            aria-label="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>

          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md">
              <Image
                src="/logo.png"
                alt="Logo"
                width={64}
                height={64}
                className="transform hover:scale-105 transition-transform"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">Account Settings</h1>
          <p className="text-green-100 mt-2">Update your profile information</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4 group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 hover:border-green-300 transition-colors">
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt="Profile avatar"
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <span className="text-3xl text-gray-500">
                        {formData.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      className="bg-green-500 hover:bg-green-600 text-white rounded-full p-2 transform hover:scale-110 transition-all"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-green-600 hover:text-green-800 text-sm font-medium transition-colors"
              >
                Change profile picture
              </button>
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-800"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  value={user?.email || ""}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                  disabled
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 ml-1">
                Email cannot be changed
              </p>
            </div>

            <div>
              <label
                htmlFor="phone_number"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-800"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Status
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  placeholder="Set a status message"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-800"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={updating}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {updating ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving Changes...
                  </div>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Account Information
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3">
                <span className="text-gray-600 dark:text-gray-400">
                  Account created
                </span>
                <span className="font-medium">
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  Last seen
                </span>
                <span className="font-medium">
                  {user?.last_seen
                    ? new Date(user.last_seen).toLocaleString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-green-600 hover:text-green-800 font-medium transition-colors underline"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
