import { User } from "@/types";
import React, { useState } from "react";
import { FiPhone, FiVideo, FiInfo, FiSearch, FiX } from "react-icons/fi";
import { RxAvatar } from "react-icons/rx";

interface ChatHeaderProps {
  selectedUser: User;
  onSearchToggle?: (isSearchOpen: boolean) => void;
  onSearch?: (searchTerm: string) => void;
}

const ChatHeader = ({ selectedUser, onSearchToggle, onSearch }: ChatHeaderProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSearch = () => {
    const newState = !isSearchOpen;
    setIsSearchOpen(newState);
    if (onSearchToggle) {
      onSearchToggle(newState);
    }
    
    // Clear search when closing
    if (!newState) {
      setSearchTerm("");
      if (onSearch) onSearch("");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      {!isSearchOpen ? (
        <>
          <div className="flex items-center">
            <div className="relative">
              <RxAvatar name={selectedUser.username} size={40} />
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                  selectedUser.status === "online" ? "bg-green-500" : "bg-gray-400"
                }`}
              ></span>
            </div>
            <div className="ml-3">
              <h2 className="font-medium text-gray-800">{selectedUser.username}</h2>
              <p className="text-sm text-gray-500">
                {selectedUser.status === "online" ? "Online" : "Offline"}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full focus:outline-none">
              <FiPhone className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full focus:outline-none">
              <FiVideo className="h-5 w-5" />
            </button>
            <button 
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full focus:outline-none"
              onClick={toggleSearch}
            >
              <FiSearch className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full focus:outline-none">
              <FiInfo className="h-5 w-5" />
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center w-full">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search in conversation..."
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearchChange}
              autoFocus
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
          <button
            className="ml-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full focus:outline-none"
            onClick={toggleSearch}
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatHeader;
