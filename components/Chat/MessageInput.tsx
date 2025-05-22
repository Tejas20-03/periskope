import React, { useState } from "react";
import { FiSend, FiPaperclip, FiSmile } from "react-icons/fi";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="p-4 bg-white border-t border-gray-200">
      <form onSubmit={handleSubmit} className="flex items-center">
        <button
          type="button"
          className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <FiPaperclip className="h-5 w-5" />
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 mx-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="button"
          className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <FiSmile className="h-5 w-5" />
        </button>
        <button
          type="submit"
          className="ml-2 p-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <FiSend className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
