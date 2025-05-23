"use client";

import { signOut } from "@/actions/auth";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";

import { TiHome } from "react-icons/ti";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { IoTicket } from "react-icons/io5";
import { GoGraph } from "react-icons/go";
import { FaList } from "react-icons/fa6";
import { FaBullhorn } from "react-icons/fa6";
import { TiFlowMerge } from "react-icons/ti";
import { BiSolidContact } from "react-icons/bi";
import { BiSolidPhotoAlbum } from "react-icons/bi";
import { LuListTodo } from "react-icons/lu";
import { FaGear } from "react-icons/fa6";

import { TbStars } from "react-icons/tb";
import { BiSolidLogOut } from "react-icons/bi";

export default function Sidebar() {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  async function handleLogout() {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Mobile hamburger menu button
  const MobileMenuButton = () => (
    <button
      onClick={toggleSidebar}
      className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md text-gray-500 hover:text-green-500 focus:outline-none md:hidden"
    >
      {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
    </button>
  );

  // Sidebar content
  const SidebarContent = () => (
    <>
      <div className="mb-4">
        <Image src="/logo.png" alt="Logo" width={32} height={32} />
      </div>
      <nav className="flex flex-col items-center space-y-1 flex-1">
        <Link
          href="/dashboard"
          className="p-2 text-gray-500 hover:text-green-500 focus:outline-none"
          onClick={() => isMobile && setIsOpen(false)}
        >
          <TiHome className="h-4 w-4" />
        </Link>
        <Link
          href="/messages"
          className="p-2 text-green-500 bg-green-50 rounded-lg focus:outline-none"
          onClick={() => isMobile && setIsOpen(false)}
        >
          <IoChatbubbleEllipses className="h-4 w-4" />
        </Link>
        <Link
          href="/users"
          className="p-2 text-gray-500 hover:text-green-500 focus:outline-none"
          onClick={() => isMobile && setIsOpen(false)}
        >
          <IoTicket className="h-4 w-4" />
        </Link>
        <Link
          href="/calendar"
          className="p-2 text-gray-500 hover:text-green-500 focus:outline-none"
          onClick={() => isMobile && setIsOpen(false)}
        >
          <GoGraph className="h-4 w-4" />
        </Link>
        <Link
          href="/analytics"
          className="p-2 text-gray-500 hover:text-green-500 focus:outline-none"
          onClick={() => isMobile && setIsOpen(false)}
        >
          <FaList className="h-4 w-4" />
        </Link>
        <Link
          href="/files"
          className="p-2 text-gray-500 hover:text-green-500 focus:outline-none"
          onClick={() => isMobile && setIsOpen(false)}
        >
          <FaBullhorn className="h-4 w-4" />
        </Link>
        <Link
          href="/bookmarks"
          className="p-2 text-gray-500 hover:text-green-500 focus:outline-none"
          onClick={() => isMobile && setIsOpen(false)}
        >
          <TiFlowMerge className="h-4 w-4" />
        </Link>
        <Link
          href="/notifications"
          className="p-2 text-gray-500 hover:text-green-500 focus:outline-none"
          onClick={() => isMobile && setIsOpen(false)}
        >
          <BiSolidContact className="h-4 w-4" />
        </Link>
        <Link
          href="/favorites"
          className="p-2 text-gray-500 hover:text-green-500 focus:outline-none"
          onClick={() => isMobile && setIsOpen(false)}
        >
          <BiSolidPhotoAlbum className="h-4 w-4" />
        </Link>
        <Link
          href="/profile"
          className="p-2 text-gray-500 hover:text-green-500 focus:outline-none"
          onClick={() => isMobile && setIsOpen(false)}
        >
          <LuListTodo className="h-4 w-4" />
        </Link>
        <Link
          href="/settings"
          className="p-2 text-gray-500 hover:text-green-500 focus:outline-none"
          onClick={() => isMobile && setIsOpen(false)}
        >
          <FaGear className="h-4 w-4" />
        </Link>
      </nav>
      <div className="mt-auto flex flex-col items-center space-y-1 pt-6">
        <Link
          href="/help"
          className="p-2 text-gray-500 hover:text-green-500 focus:outline-none"
          onClick={() => isMobile && setIsOpen(false)}
        >
          <TbStars className="h-4 w-4" />
        </Link>
        <button
          onClick={() => {
            handleLogout();
            isMobile && setIsOpen(false);
          }}
          className="p-2 text-gray-500 hover:text-red-500 focus:outline-none"
        >
          <BiSolidLogOut className="h-4 w-4" />
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && <MobileMenuButton />}

      {/* Desktop sidebar - always visible */}
      <div className="hidden md:flex w-16 bg-white border-r border-gray-200 flex-col justify-between h-screen items-center py-3 fixed left-0 top-0">
        <SidebarContent />
      </div>

      {/* Mobile sidebar - conditionally visible */}
      {isMobile && (
        <div
          className={`fixed inset-0 z-40 transition-all duration-300 ${
            isOpen ? "visible" : "invisible"
          }`}
        >
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black transition-opacity duration-300 ${
              isOpen ? "opacity-50" : "opacity-0"
            }`}
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Sidebar */}
          <div
            className={`absolute left-0 top-0 h-full w-16 bg-white border-r border-gray-200 flex flex-col justify-between items-center py-3 transform transition-transform duration-300 ${
              isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Content spacing for desktop */}
      <div className="hidden md:block w-16"></div>
    </>
  );
}
