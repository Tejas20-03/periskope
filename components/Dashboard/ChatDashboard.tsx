"use client";

import { BsChatDotsFill } from "react-icons/bs";
import Sidebar from "./Sidebar";
import { LuRefreshCcwDot } from "react-icons/lu";
import { useEffect, useRef, useState } from "react";
import { MdHelpOutline } from "react-icons/md";
import { VscDesktopDownload } from "react-icons/vsc";
import { FaBellSlash, FaList } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { Message, User } from "@/types";
import { getCurrentUser, getUsers } from "@/actions/user";
import UserList from "./UserList";
import ChatArea from "../Chat/ChatArea";
import {
  getMessages,
  markMessagesAsRead,
  sendMessage,
} from "@/actions/messages";
import { createClient } from "@/utils/supabase/client";

export default function ChatDashboard() {
  const [loading, setLoading] = useState<boolean>(false);
  const [messagesLoading, setMessagesLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [showUserList, setShowUserList] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterOptions, setFilterOptions] = useState({
    onlineOnly: false,
    hasMessages: false,
  });
  const supabase = createClient();
  const subscriptionRef = useRef<any>(null);

  // Check for mobile view
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkMobileView();
    window.addEventListener("resize", checkMobileView);

    return () => {
      window.removeEventListener("resize", checkMobileView);
    };
  }, []);

  // When a user is selected in mobile view, hide the user list
  useEffect(() => {
    if (isMobileView && selectedUser) {
      setShowUserList(false);
    }
  }, [selectedUser, isMobileView]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const { users: fetchedUsers, error: usersError } = await getUsers();
      if (usersError) {
        setError(usersError);
        return;
      }
      if (fetchedUsers) {
        const filteredUsers = currentUser
          ? fetchedUsers.filter((user) => user.id !== currentUser.id)
          : fetchedUsers;

        setUsers(filteredUsers);
        setFilteredUsers(filteredUsers);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentUser = async () => {
    try {
      setLoading(true);
      setError(null);

      const { user, error: userError } = await getCurrentUser();

      if (userError) {
        setError(userError);
        return;
      }

      if (user) {
        setCurrentUser(user);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch current user"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  // Load messages when a user is selected
  const loadMessages = async () => {
    if (!currentUser || !selectedUser) return;

    try {
      setMessagesLoading(true);
      setError(null);

      const { messages: fetchedMessages, error: messagesError } =
        await getMessages(currentUser.id, selectedUser.id);

      if (messagesError) {
        setError(messagesError);
        return;
      }

      if (fetchedMessages) {
        setMessages(fetchedMessages);

        // Mark messages as read
        await markMessagesAsRead(currentUser.id, selectedUser.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch messages");
    } finally {
      setMessagesLoading(false);
    }
  };

  // Setup real-time subscription
  const setupRealtimeSubscription = () => {
    if (!currentUser || !selectedUser) return;

    // Clean up previous subscription if it exists
    if (subscriptionRef.current) {
      supabase.removeChannel(subscriptionRef.current);
    }

    // Create new subscription
    const channel = supabase
      .channel(`chat-${currentUser.id}-${selectedUser.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `and(or(sender.eq.${currentUser.id},sender.eq.${selectedUser.id}),or(receiver.eq.${currentUser.id},receiver.eq.${selectedUser.id}))`,
        },
        (payload) => {
          const newMessage = {
            ...payload.new,
            timestamp: new Date(payload.new.timestamp),
          } as Message;

          // Only add the message if it's not already in the list
          setMessages((prev) => {
            if (prev.some((msg) => msg.id === newMessage.id)) {
              return prev;
            }
            return [...prev, newMessage];
          });

          // Mark message as read if it's from the selected user
          if (
            payload.new.sender === selectedUser.id &&
            payload.new.receiver === currentUser.id
          ) {
            markMessagesAsRead(currentUser.id, selectedUser.id);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `and(or(sender.eq.${currentUser.id},sender.eq.${selectedUser.id}),or(receiver.eq.${currentUser.id},receiver.eq.${selectedUser.id}))`,
        },
        (payload) => {
          const updatedMessage = {
            ...payload.new,
            timestamp: new Date(payload.new.timestamp),
          } as Message;

          // Update the message in the list
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === updatedMessage.id ? updatedMessage : msg
            )
          );
        }
      )
      .subscribe();

    subscriptionRef.current = channel;
  };

  // Handle user selection
  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setMessages([]); // Clear previous messages
  };

  // Clean up subscription when component unmounts
  useEffect(() => {
    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
      }
    };
  }, []);

  // Setup subscription when selected user changes
  useEffect(() => {
    if (currentUser && selectedUser) {
      setupRealtimeSubscription();
      loadMessages();
    }
  }, [selectedUser, currentUser]);

  const handleSendMessage = async (text: string) => {
    if (!currentUser || !selectedUser) return;

    try {
      // Optimistically add message to UI
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        sender: currentUser.id,
        receiver: selectedUser.id,
        text,
        timestamp: new Date(),
        read: false,
      };

      setMessages((prev) => [...prev, optimisticMessage]);

      const { message, error: sendError } = await sendMessage(
        currentUser.id,
        selectedUser.id,
        text
      );

      if (sendError) {
        // Remove optimistic message if there was an error
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== optimisticMessage.id)
        );
        setError(sendError);
        return;
      }

      // Replace optimistic message with real one if needed
      // (though the real-time subscription should handle this)
      if (message) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === optimisticMessage.id ? message : msg))
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    }
  };

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchUsers();

      // Set up a real-time subscription for user status changes
      const userStatusChannel = supabase
        .channel("user-status-changes")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "user_profiles",
          },
          (payload) => {
            // Update user in the list if their status changes
            setUsers((prev) => {
              const updatedUsers = prev.map((user) =>
                user.id === payload.new.id
                  ? {
                      ...user,
                      status: payload.new.status,
                      last_seen: payload.new.last_seen,
                    }
                  : user
              );

              // Also update filtered users
              applyFiltersAndSearch(updatedUsers, searchTerm, filterOptions);

              return updatedUsers;
            });

            // Also update selected user if it's the one that changed
            if (selectedUser && selectedUser.id === payload.new.id) {
              setSelectedUser((prev) =>
                prev
                  ? {
                      ...prev,
                      status: payload.new.status,
                      last_seen: payload.new.last_seen,
                    }
                  : prev
              );
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(userStatusChannel);
      };
    }
  }, [currentUser]);

  // Apply filters and search
  const applyFiltersAndSearch = (
    userList: User[],
    search: string,
    filters: typeof filterOptions
  ) => {
    let result = [...userList];

    // Apply search
    if (search.trim()) {
      result = result.filter(
        (user) =>
          user.username.toLowerCase().includes(search.toLowerCase()) ||
          (user.phone_number && user.phone_number.includes(search))
      );
    }

    // Apply filters
    if (filters.onlineOnly) {
      result = result.filter((user) => user.status === "online");
    }

    // We'll implement hasMessages filter in a separate effect since it requires async data

    setFilteredUsers(result);
  };

  // Apply hasMessages filter when we have message data
  useEffect(() => {
    if (filterOptions.hasMessages && currentUser) {
      // This would ideally be done on the server, but for now we'll filter client-side
      const fetchUserMessages = async () => {
        const usersWithMessages = [];

        for (const user of users) {
          const { messages } = await getMessages(currentUser.id, user.id);
          if (messages && messages.length > 0) {
            usersWithMessages.push(user);
          }
        }

        setFilteredUsers(usersWithMessages);
      };

      fetchUserMessages();
    } else {
      // If hasMessages filter is off, apply other filters
      applyFiltersAndSearch(users, searchTerm, filterOptions);
    }
  }, [filterOptions.hasMessages, users, currentUser]);

  // Apply search and filters when they change
  useEffect(() => {
    applyFiltersAndSearch(users, searchTerm, filterOptions);
  }, [searchTerm, filterOptions.onlineOnly, users]);

  const handleRefresh = () => {
    fetchUsers();
    if (selectedUser) {
      loadMessages();
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (
    filterName: keyof typeof filterOptions,
    value: boolean
  ) => {
    setFilterOptions((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const toggleUserList = () => {
    setShowUserList((prev) => !prev);
  };

  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* Sidebar - hide on mobile */}
      <div className={`${isMobileView ? "hidden" : "block"}`}>
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1">
        <div className="bg-white shadow-sm border-b border-gray-200 py-2 px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {isMobileView && selectedUser && !showUserList && (
              <button onClick={toggleUserList} className="mr-2 text-gray-500">
                <FaList className="h-4 w-4" />
              </button>
            )}
            <BsChatDotsFill className="h-4 w-4 text-gray-400" />
            <h1 className="text-[12px] font-bold text-gray-400">chats</h1>
            {selectedUser && (
              <span className="ml-2 text-sm font-medium text-gray-600 hidden md:inline">
                {selectedUser.username}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 px-4 py-1 bg-white rounded-sm shadow-sm hover:bg-gray-50 transition-colors"
            >
              <LuRefreshCcwDot
                className={`h-4 w-4 text-gray-500 ${
                  loading ? "animate-spin" : ""
                }`}
              />
              <h1 className="text-[12px] font-bold text-gray-500 hidden sm:inline">
                Refresh
              </h1>
            </button>

            <button className="flex items-center space-x-2 px-4 py-1 bg-white rounded-sm shadow-sm hover:bg-gray-50 transition-colors hidden sm:flex">
              <MdHelpOutline className="h-4 w-4 text-gray-500" />
              <h1 className="text-[12px] font-bold text-gray-500">Help</h1>
            </button>

            <button className="flex items-center space-x-2 px-4 py-1 bg-white rounded-sm shadow-sm hover:bg-gray-50 transition-colors hidden md:flex">
              <span className="text-[12px] font-bold text-gray-500">
                {filteredUsers.length}/{users.length + 1} users
              </span>
            </button>

            <button className="px-4 py-1 bg-white rounded-sm shadow hover:bg-gray-50 transition-colors hidden md:block">
              <VscDesktopDownload className="h-4 w-4 text-gray-500" />
            </button>

            <button className="px-4 py-1 bg-white rounded-sm shadow hover:bg-gray-50 transition-colors hidden md:block">
              <FaBellSlash className="h-4 w-4 text-gray-500" />
            </button>

            {isMobileView && selectedUser && showUserList && (
              <button
                onClick={toggleUserList}
                className="px-4 py-1 bg-white rounded-sm shadow hover:bg-gray-50 transition-colors"
              >
                <IoMdClose className="h-4 w-4 text-gray-500" />
              </button>
            )}

            {!isMobileView && (
              <button className="px-4 py-1 bg-white rounded-sm shadow hover:bg-gray-50 transition-colors">
                <FaList className="h-4 w-4 text-gray-500" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* User list - conditionally show based on mobile view state */}
          {(!isMobileView || showUserList) && (
            <UserList
              users={filteredUsers}
              selectedUser={selectedUser}
              onSelectUser={handleSelectUser}
              loading={loading}
              error={error}
              currentUserId={currentUser?.id || ""}
              onSearch={handleSearch}
              searchTerm={searchTerm}
              filterOptions={filterOptions}
              //@ts-ignore
              onFilterChange={handleFilterChange}
              className={isMobileView ? "w-full" : "w-1/4"}
            />
          )}

          {/* Chat area - conditionally show based on mobile view state */}
          {(!isMobileView || !showUserList) && (
            <ChatArea
              selectedUser={selectedUser}
              messages={messages}
              onSendMessage={handleSendMessage}
              formatTime={formatTime}
              loading={messagesLoading}
              currentUserId={currentUser?.id || ""}
              users={users.concat(currentUser ? [currentUser] : [])}
              onBackClick={isMobileView ? toggleUserList : undefined}
            />
          )}
        </div>
      </div>
    </div>
  );
}
