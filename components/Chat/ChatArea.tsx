import { ChatAreaProps } from "@/types";
import { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { FaArrowLeft } from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";
import { BsChatDotsFill } from "react-icons/bs";
import Image from "next/image";

const ChatArea = ({
  selectedUser,
  messages,
  onSendMessage,
  formatTime,
  loading = false,
  currentUserId,
  users = [],
  onBackClick,
}: ChatAreaProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const formatLastSeen = (dateString: string) => {
    if (!dateString) return "a while ago";

    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `today at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `yesterday at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return `on ${date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year:
          date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      })}`;
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center p-6">
            <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <BsChatDotsFill className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700">
              Select a conversation
            </h3>
            <p className="text-gray-500 mt-2 max-w-md">
              Choose from your existing conversations on the left or start a new
              chat
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Replace the custom header with the ChatHeader component */}
      {onBackClick ? (
        <div className="bg-white shadow-sm border-b border-gray-200 p-3 flex items-center">
          <button
            onClick={onBackClick}
            className="mr-3 text-gray-500 hover:text-gray-700"
            aria-label="Go back to user list"
          >
            <FaArrowLeft className="h-4 w-4" />
          </button>
          <ChatHeader selectedUser={selectedUser} onSearch={handleSearch} />
        </div>
      ) : (
        <ChatHeader selectedUser={selectedUser} onSearch={handleSearch} />
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75 z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : null}

        {messages.length === 0 && !loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center p-6">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <BsChatDotsFill className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">
                No messages yet
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Send a message to start the conversation
              </p>
            </div>
          </div>
        ) : (
          <MessageList
            messages={messages}
            formatTime={formatTime}
            currentUserId={currentUserId}
            users={users}
            searchTerm={searchTerm}
          />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
};

export default ChatArea;
