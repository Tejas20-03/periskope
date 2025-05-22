"use client";

import { signOut } from "@/actions/auth";
import Image from "next/image";
import {
  FiHome,
  FiLogOut,
  FiMessageSquare,
  FiSettings,
  FiUsers,
} from "react-icons/fi";

export default function Sidebar() {
  async function handleLogout() {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-6">
      <div className="mb-8">
        <Image src="/logo-green.svg" alt="Logo" width={32} height={32} />
      </div>
      <nav className="flex flex-col items-center space-y-6 flex-1">
        <button className="p-2 text-gray-500 hover:text-green-500 focus:outline-none">
          <FiHome className="h-6 w-6" />
        </button>
        <button className="p-2 text-green-500 bg-green-50 rounded-lg focus:outline-none">
          <FiMessageSquare className="h-6 w-6" />
        </button>
        <button className="p-2 text-gray-500 hover:text-green-500 focus:outline-none">
          <FiUsers className="h-6 w-6" />
        </button>
        <button className="p-2 text-gray-500 hover:text-green-500 focus:outline-none">
          <FiSettings className="h-6 w-6" />
        </button>
      </nav>
      <button
        onClick={() => handleLogout()}
        className="p-2 text-gray-500 hover:text-red-500 focus:outline-none mt-auto"
      >
        <FiLogOut className="h-6 w-6" />
      </button>
    </div>
  );
}
