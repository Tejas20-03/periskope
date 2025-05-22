import { User } from "@/types";
import React from "react";
import { FiPhone, FiVideo, FiInfo } from "react-icons/fi";
import { RxAvatar } from "react-icons/rx";

interface ChatHeaderProps {
  selectedUser: User;
}

const ChatHeader = ({ selectedUser }: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
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
        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full focus:outline-none">
          <FiInfo className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
