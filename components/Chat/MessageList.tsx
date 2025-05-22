import { Message } from "@/types";
import React from "react";
import { RxAvatar } from "react-icons/rx";

interface MessageListProps {
  messages: Message[];
  formatTime: (date: Date) => string;
}

const MessageList = ({ messages, formatTime }: MessageListProps) => {
  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-500">
          <p>No messages yet</p>
          <p className="text-sm mt-2">
            Start the conversation by sending a message
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.sender === "user" ? "justify-end" : "justify-start"
          }`}
        >
          {message.sender !== "user" && (
            <div className="mr-2">
              <RxAvatar name="Other" size={32} />
            </div>
          )}
          <div
            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.sender === "user"
                ? "bg-green-500 text-white"
                : "bg-white text-gray-800 border border-gray-200"
            }`}
          >
            <p>{message.text}</p>
            <div
              className={`text-xs mt-1 ${
                message.sender === "user" ? "text-green-100" : "text-gray-500"
              }`}
            >
              {formatTime(message.timestamp)}
            </div>
          </div>
          {message.sender === "user" && (
            <div className="ml-2">
              <RxAvatar name="You" size={32} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
