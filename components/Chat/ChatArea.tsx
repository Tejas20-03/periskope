import { ChatAreaProps } from "@/types";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

const ChatArea = ({
  selectedUser,
  messages,
  onSendMessage,
  formatTime,
}: ChatAreaProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  if (!selectedUser) {
    return (
      <div className="w-3/4 flex flex-col">
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-300 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-gray-500 text-lg">
              Select a conversation to start chatting
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Choose from your existing conversations on the left
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="w-3/4 flex flex-col">
      <ChatHeader selectedUser={selectedUser} />
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <MessageList messages={messages} formatTime={formatTime} />
        <div ref={messagesEndRef} />
      </div>
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
};

export default ChatArea;
