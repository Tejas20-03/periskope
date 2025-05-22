"use client";

import { BsChatDotsFill } from "react-icons/bs";
import Sidebar from "./Sidebar";
import { LuRefreshCcwDot } from "react-icons/lu";
import { useEffect, useRef, useState } from "react";
import { MdHelpOutline } from "react-icons/md";
import { VscDesktopDownload } from "react-icons/vsc";
import { FaBellSlash, FaList } from "react-icons/fa";
import { Message, User } from "@/types";
import { getCurrentUser, getUsers } from "@/actions/user";
import UserList from "./UserList";
import ChatArea from "../Chat/ChatArea";

export default function ChatDashboard() {
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const messagesSubscription = useRef<any>(null);

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
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSendMessage = async (text: string) => {
   
  };

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

  const handleRefresh = () => {
    fetchUsers();
  };

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <div className="bg-white shadow-sm border-b border-gray-200 py-2 px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BsChatDotsFill className="h-4 w-4 text-gray-400" />
            <h1 className="text-[12px] font-bold text-gray-400">chats</h1>
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
              <h1 className="text-[12px] font-bold text-gray-500">Refresh</h1>
            </button>

            <button className="flex items-center space-x-2 px-4 py-1 bg-white rounded-sm shadow-sm hover:bg-gray-50 transition-colors">
              <MdHelpOutline className="h-4 w-4 text-gray-500" />
              <h1 className="text-[12px] font-bold text-gray-500">Help</h1>
            </button>

            <button className="flex items-center space-x-2 px-4 py-1 bg-white rounded-sm shadow-sm hover:bg-gray-50 transition-colors">
              <span className="text-[12px] font-bold text-gray-500">
                {users.length}/{users.length + 1} users
              </span>
            </button>

            <button className="px-4 py-1 bg-white rounded-sm shadow hover:bg-gray-50 transition-colors">
              <VscDesktopDownload className="h-4 w-4 text-gray-500" />
            </button>

            <button className="px-4 py-1 bg-white rounded-sm shadow hover:bg-gray-50 transition-colors">
              <FaBellSlash className="h-4 w-4 text-gray-500" />
            </button>

            <button className="px-4 py-1 bg-white rounded-sm shadow hover:bg-gray-50 transition-colors">
              <FaList className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <UserList
            users={users}
            selectedUser={selectedUser}
            onSelectUser={setSelectedUser}
            loading={loading}
            error={error}
          />
          <ChatArea
            selectedUser={selectedUser}
            messages={messages}
            onSendMessage={handleSendMessage}
            formatTime={formatTime}
          />
        </div>
      </div>
    </div>
  );
}
