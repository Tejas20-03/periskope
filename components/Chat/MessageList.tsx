import { Message, User } from "@/types";
import React, { useEffect, useRef, useState } from "react";
import { RxAvatar } from "react-icons/rx";
import { IoMdSend } from "react-icons/io";
import { FiSend } from "react-icons/fi";

interface MessageListProps {
  messages: Message[];
  formatTime: (date: Date) => string;
  currentUserId: string;
  users?: User[]; // Add users to get sender details
  searchTerm?: string;
}

const MessageList = ({
  messages,
  formatTime,
  currentUserId,
  users = [],
  searchTerm = "",
}: MessageListProps) => {
  const [filteredMessages, setFilteredMessages] = useState<Message[]>(messages);
  const [highlightedMessageId, setHighlightedMessageId] = useState<
    string | null
  >(null);
  const highlightedRef = useRef<HTMLDivElement>(null);

  // Filter messages when search term changes
  useEffect(() => {
    if (!searchTerm) {
      setFilteredMessages(messages);
      setHighlightedMessageId(null);
      return;
    }

    const filtered = messages.filter((message) =>
      message.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredMessages(filtered);

    // Highlight the first match
    if (filtered.length > 0) {
      setHighlightedMessageId(filtered[0].id);
    } else {
      setHighlightedMessageId(null);
    }
  }, [searchTerm, messages]);

  // Scroll to highlighted message
  useEffect(() => {
    if (highlightedMessageId && highlightedRef.current) {
      highlightedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [highlightedMessageId]);

  // Direct background style with a higher opacity
  const containerStyle = {
    backgroundImage: "url('/whatsapp-bg.avif')",
    backgroundRepeat: "repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100%",
    width: "100%",
    position: "relative" as "relative",
  };

  // Semi-transparent overlay to lighten the background
  const overlayStyle = {
    position: "absolute" as "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)", // White with 80% opacity
  };

  // Content container style
  const contentStyle = {
    position: "relative" as "relative",
    zIndex: 1,
    height: "100%",
  };

  // Helper function to find user details by ID
  const getUserById = (userId: string) => {
    return users.find((user) => user.id === userId) || null;
  };

  // Helper function to highlight search term in text
  const highlightText = (text: string, term: string) => {
    if (!term) return text;

    const regex = new RegExp(`(${term})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-yellow-300">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  if (filteredMessages.length === 0) {
    return (
      <div style={containerStyle} className="flex items-center justify-center">
        <div style={overlayStyle}></div>
        <div
          style={contentStyle}
          className="text-center text-gray-500 p-4 rounded-lg"
        >
          {searchTerm ? (
            <p>No messages found matching "{searchTerm}"</p>
          ) : (
            <>
              <p>No messages yet</p>
              <p className="text-sm mt-2">
                Start the conversation by sending a message
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  // Group messages by date
  const groupedMessages: { [key: string]: Message[] } = {};

  filteredMessages.forEach((message) => {
    const date = message.timestamp.toDateString();
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });

  return (
    <div style={containerStyle} className="h-full w-full">
      <div style={overlayStyle}></div>
      <div
        style={contentStyle}
        className="space-y-6 overflow-y-auto p-4 h-full"
      >
        {searchTerm && (
          <div className="sticky top-0 bg-blue-100 text-blue-800 px-4 py-2 rounded-md text-sm z-10">
            Showing results for: "{searchTerm}" ({filteredMessages.length}{" "}
            {filteredMessages.length === 1 ? "message" : "messages"} found)
          </div>
        )}

        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date} className="space-y-4">
            <div className="flex justify-center">
              <div className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                {new Date(date).toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>

            {dateMessages.map((message, index) => {
              // Determine if the message is from the current user
              const isCurrentUser = message.sender === currentUserId;
              const sender = getUserById(message.sender);

              // Check if this is the first message from this sender in the sequence
              const isFirstInSequence =
                index === 0 ||
                dateMessages[index - 1].sender !== message.sender;

              // Check if this message is highlighted
              const isHighlighted = message.id === highlightedMessageId;

              return (
                <div
                  key={message.id}
                  ref={isHighlighted ? highlightedRef : null}
                  className={`flex ${
                    isCurrentUser ? "justify-end" : "justify-start"
                  } ${isHighlighted ? "animate-pulse" : ""}`}
                >
                  {!isCurrentUser && (
                    <div className="mr-2">
                      <RxAvatar className="h-8 w-8 text-gray-600" />
                    </div>
                  )}

                  {/* Different message styling based on sender */}
                  {isCurrentUser ? (
                    // Current user's message (sender) with enhanced styling
                    <div
                      className={`max-w-xs lg:max-w-md rounded-lg bg-green-100 text-gray-800 ${
                        isHighlighted ? "ring-2 ring-yellow-500" : ""
                      }`}
                    >
                      {/* Message header with name and phone */}
                      <div className="px-4 pt-2 flex justify-between items-center">
                        <span className="font-semibold text-sm text-green-600 ">
                          {sender?.username}
                        </span>
                        <span className="text-xs text-gray-500">
                          {sender?.phone_number || "No phone"}
                        </span>
                      </div>

                      <div className="px-4 py-2">
                        <p>{highlightText(message.text, searchTerm)}</p>
                      </div>

                      <div className="px-4 pb-2 flex justify-between items-center text-xs gap-4">
                        <div className="flex items-center text-gray-500">
                          <FiSend className="h-3 w-3 mr-1" />
                          <span>{sender?.email || "No email"}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-1">
                            {formatTime(message.timestamp)}
                          </span>
                          <span>
                            {message.read ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3 text-blue-500"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3 text-gray-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-1 rounded-lg bg-white text-gray-800 border border-gray-200 shadow ${
                        isHighlighted ? "ring-2 ring-yellow-500" : ""
                      }`}
                    >
                      {isFirstInSequence && (
                        <div className="flex flex-row items-center space-between gap-4">
                          <span className="font-semibold text-xs text-green-600">
                            {sender?.username || "Unknown"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {sender?.phone_number || "No phone"}
                          </span>
                        </div>
                      )}
                      <p className="text-sm font-medium">
                        {highlightText(message.text, searchTerm)}
                      </p>
                      <div className="text-[10px] mt-1 text-gray-500 flex justify-end">
                        <span>{formatTime(message.timestamp)}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageList;
