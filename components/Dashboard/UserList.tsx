import { UserListProps } from "@/types";
import { BsInbox, BsTag } from "react-icons/bs";
import { FiFilter, FiSearch } from "react-icons/fi";
import { RxAvatar } from "react-icons/rx";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { getMessages } from "@/actions/messages";
import { IoFilterOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";

const UserList = ({
  users,
  selectedUser,
  onSelectUser,
  loading = false,
  error = null,
  currentUserId,
  onSearch,
  searchTerm = "",
  filterOptions = { onlineOnly: false, hasMessages: false },
  onFilterChange,
  className = "w-1/4",
}: UserListProps) => {
  const [userLastMessages, setUserLastMessages] = useState<{
    [key: string]: {
      text: string;
      sender: string;
      timestamp: Date;
    } | null;
  }>({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Fetch last message for each user
  useEffect(() => {
    const fetchLastMessages = async () => {
      if (!currentUserId || users.length === 0) return;

      const lastMessagesMap: { [key: string]: any } = {};

      // Create an array of promises to fetch messages for all users in parallel
      const fetchPromises = users.map(async (user) => {
        try {
          const { messages, error } = await getMessages(currentUserId, user.id);
          if (messages && messages.length > 0) {
            // Sort messages by timestamp (newest first)
            const sortedMessages = [...messages].sort(
              (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
            );

            // Get the most recent message
            const lastMessage = sortedMessages[0];

            lastMessagesMap[user.id] = {
              text: lastMessage.text,
              sender: lastMessage.sender,
              timestamp: lastMessage.timestamp,
            };
          } else {
            lastMessagesMap[user.id] = null;
          }
        } catch (err) {
          console.error(`Error fetching messages for user ${user.id}:`, err);
          lastMessagesMap[user.id] = null;
        }
      });

      // Wait for all fetches to complete
      await Promise.all(fetchPromises);

      setUserLastMessages(lastMessagesMap);
    };

    fetchLastMessages();
  }, [users, currentUserId]);

  const formatLastSeen = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Format the last message timestamp
  const formatLastMessageTime = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
    }
  };

  // Get sender name
  const getSenderName = (userId: string, users: any[]) => {
    if (userId === currentUserId) return "You";
    const user = users.find((u) => u.id === userId);
    return user ? user.username : "Unknown";
  };

  const toggleFilterPanel = () => {
    setShowFilterPanel(!showFilterPanel);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const handleFilterOptionChange = (filterName: string) => {
    if (onFilterChange) {
      onFilterChange(
        filterName,
        !filterOptions[filterName as keyof typeof filterOptions]
      );
    }
  };

  return (
    <div
      className={`border-r border-gray-200 bg-white flex flex-col ${className}`}
    >
      <div className="p-2 border-b border-gray-200">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-1">
            <BsInbox className="h-4 w-4 text-green-500" />
            <h2 className="font-bold text-sm text-green-500">Custom Filter</h2>
          </div>
          <button
            className="flex items-center px-2 py-1 bg-white rounded-sm shadow-sm hover:bg-gray-50 transition-colors"
            onClick={toggleFilterPanel}
          >
            <span className="text-[12px] font-bold text-gray-500">
              {showFilterPanel ? "Close" : "Filter"}
            </span>
          </button>
        </div>

        {/* Search bar */}
        <div className="relative mt-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 w-full text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => onSearch && onSearch("")}
            >
              <IoMdClose className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Filter panel */}
        {showFilterPanel && (
          <div className="mt-2 p-2 bg-gray-50 rounded-md">
            <h3 className="text-xs font-semibold text-gray-600 mb-2">
              Filter Options
            </h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={filterOptions.onlineOnly}
                  onChange={() => handleFilterOptionChange("onlineOnly")}
                  className="rounded text-green-500 focus:ring-green-500"
                />
                <span>Online users only</span>
              </label>
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={filterOptions.hasMessages}
                  onChange={() => handleFilterOptionChange("hasMessages")}
                  className="rounded text-green-500 focus:ring-green-500"
                />
                <span>Users with messages</span>
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-y-auto flex-1">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="p-4 text-red-500 text-center">
            {error}
            <p className="text-sm mt-2">Please try refreshing.</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-4 text-gray-500 text-center">
            {searchTerm ? "No users match your search." : "No users found."}
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100 ${
                selectedUser?.id === user.id ? "bg-gray-100" : ""
              }`}
              onClick={() => onSelectUser(user)}
            >
              <div className="flex items-start">
                {/* Left side - Avatar */}
                <div className="relative flex-shrink-0">
                  {user.avatar_url ? (
                    <div className="h-12 w-12 rounded-full overflow-hidden">
                      <Image
                        src={user.avatar_url}
                        alt={user.username}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <RxAvatar className="h-12 w-12 text-gray-400" />
                  )}
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      user.status === "online" ? "bg-green-500" : "bg-gray-400"
                    }`}
                  ></span>
                </div>

                {/* Middle content */}
                <div className="ml-3 flex-grow min-w-0">
                  <p className="font-bold text-gray-800 truncate">
                    {user.username}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                    {userLastMessages[user.id] ? (
                      <>
                        <span className="font-medium">
                          {getSenderName(
                            userLastMessages[user.id]?.sender || "",
                            users
                          )}
                          :
                        </span>{" "}
                        {userLastMessages[user.id]?.text}
                      </>
                    ) : (
                      <span className="italic text-gray-400">
                        No messages yet
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    {user.phone_number}
                  </p>
                </div>

                {/* Right side content */}
                <div className="flex flex-col items-end ml-2 min-w-[60px]">
                  <div className="flex items-center">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {user.status === "online" ? "online" : "offline"}
                    </span>
                    <BsTag className="h-3 w-3 text-gray-400 ml-1" />
                  </div>

                  {/* Conversation participants */}
                  <div className="flex mt-1">
                    {/* Current user avatar */}
                    <div className="h-5 w-5 rounded-full bg-green-200 flex items-center justify-center text-[8px] -mr-1 border border-white">
                      You
                    </div>
                    {/* Other user avatar */}
                    <div className="h-5 w-5 rounded-full bg-gray-300 flex items-center justify-center text-[8px] border border-white">
                      {user.username.substring(0, 2).toUpperCase()}
                    </div>
                  </div>

                  {/* Last message time or last seen */}
                  <p className="text-[10px] text-gray-400 mt-1">
                    {userLastMessages[user.id]
                      ? formatLastMessageTime(
                          userLastMessages[user.id]?.timestamp as Date
                        )
                      : formatLastSeen(user.last_seen)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserList;
