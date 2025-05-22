import { UserListProps } from "@/types";
import { BsInbox } from "react-icons/bs";
import { FiFilter, FiSearch } from "react-icons/fi";
import { RxAvatar } from "react-icons/rx";

const UserList = ({
  users,
  selectedUser,
  onSelectUser,
  loading = false,
  error = null,
}: UserListProps) => {
  return (
    <div className="w-1/4 border-r border-gray-200 bg-white flex flex-col">
      <div className="p-2 border-b border-gray-200">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-1">
            <BsInbox className="h-4 w-4 text-green-500" />
            <h2 className="font-bold text-sm text-green-500">Custom Filter</h2>
          </div>
          <button className="flex items-center px-2 py-1 bg-white rounded-sm shadow-sm hover:bg-gray-50 transition-colors">
            <span className="text-[12px] font-bold text-gray-500">Save</span>
          </button>
          <div className="flex items-center space-x-2">
            <button className=" flex items-center px-3 py-1 bg-white rounded-sm shadow-sm hover:bg-gray-50 transition-colors">
              <FiSearch className="h-4 w-4 text-gray-500" />
              <span className="text-[12px] font-bold text-gray-500">
                Search
              </span>
            </button>
            <button className=" flex items-center px-3 py-1 bg-white rounded-sm shadow-sm hover:bg-gray-50 transition-colors">
              <FiFilter className="h-4 w-4 text-gray-500" />
              <span className="text-[12px] font-bold text-gray-500">
                Filter
              </span>
            </button>
          </div>
        </div>
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
          <div className="p-4 text-gray-500 text-center">No users found.</div>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 flex items-center ${
                selectedUser?.id === user.id ? "bg-gray-100" : ""
              }`}
              onClick={() => onSelectUser(user)}
            >
              <div className="relative">
                <RxAvatar name={user.username} size={48} />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                    user.status === "online" ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></span>
              </div>
              <div className="ml-3">
                <p className="font-medium">{user.username}</p>
                {/* <p className="text-sm text-gray-500">{user.lastSeen}</p> */}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserList;
