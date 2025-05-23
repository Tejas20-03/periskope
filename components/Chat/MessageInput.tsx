import React, { useState, useRef } from "react";
import {
  FiSend,
  FiPaperclip,
  FiSmile,
  FiClock,
  FiChevronDown,
} from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import { PiClockClockwiseFill } from "react-icons/pi";
import { FaSquarePollHorizontal, FaMicrophone } from "react-icons/fa6";

import Image from "next/image";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      console.log("Sending message:", message);
      onSendMessage(message);
      setMessage("");
      setIsTyping(false);

      // Focus the input after sending
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);

    // Set typing indicator
    if (value.length > 0 && !isTyping) {
      setIsTyping(true);
    } else if (value.length === 0 && isTyping) {
      setIsTyping(false);
    }
  };

  return (
    <div className="p-3 bg-white ">
      <div className="rounded-lg  overflow-hidden">
        {/* Top row: Message input and send button */}
        <div className="flex items-center p-2">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Message..."
            className="flex-1 p-2 focus:outline-none border-none text-gray-700"
            style={{ border: "none" }}
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!message.trim()}
            className={`p-2 rounded-full text-green-500 hover:bg-green-50 `}
          >
            <FiSend className="h-5 w-5 transform rotate-45" />
          </button>
        </div>

        {/* Bottom row: Various icons and Periskope dropdown */}
        <div className="flex items-center justify-between bg-gray-50 p-2 ">
          <div className="flex space-x-6">
            <button className="text-gray-600 hover:text-gray-800 focus:outline-none">
              <FiPaperclip className="h-5 w-5" />
            </button>
            <button className="text-gray-600 hover:text-gray-800 focus:outline-none">
              <FiSmile className="h-5 w-5" />
            </button>
            <button className="text-gray-600 hover:text-gray-800 focus:outline-none">
              <FiClock className="h-5 w-5" />
            </button>
            <button className="text-gray-600 hover:text-gray-800 focus:outline-none">
              <PiClockClockwiseFill className="h-5 w-5" />
            </button>
            <button className="text-gray-600 hover:text-gray-800 focus:outline-none">
              <BsStars className="h-5 w-5" />
            </button>
            <button className="text-gray-600 hover:text-gray-800 focus:outline-none">
              <FaSquarePollHorizontal className="h-5 w-5" />
            </button>
            <button className="text-gray-600 hover:text-gray-800 focus:outline-none">
              <FaMicrophone className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center">
            <button className="flex items-center space-x-2 px-3 py-1 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <div className="w-5 h-5 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Periskope Logo"
                  width={20}
                  height={20}
                  className="rounded-full"
                />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Periskope
              </span>
              <FiChevronDown className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
