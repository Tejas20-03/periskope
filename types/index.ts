export interface SignUpForm {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface SignInForm {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  phone_number: string;
  status: string;
  avatar_url?: string;
  last_seen: string;
  created_at?: string;
  groups: string[];
}

export interface ChatAreaProps {
  selectedUser: User | null;
  messages: Message[];
  onSendMessage: (message: string) => void;
  formatTime: (date: Date) => string;
  loading?: boolean;
  currentUserId: string;
  onBackClick?: () => void
}


export interface Message {
  id: string;
  text: string;
  sender: string;
  receiver: string;
  timestamp: Date;
  read: boolean;
}

export interface UserListProps {
  users: User[];
  selectedUser: User | null;
  onSelectUser: (user: User) => void;
  loading?: boolean;
  error?: string | null;
  currentUserId: string;
  onSearch?: (term: string) => void;
  searchTerm?: string;
  filterOptions?: { 
    onlineOnly: boolean; 
    hasMessages: boolean;
  };
  onFilterChange?: (filterName: string, value: boolean) => void;
  className?: string;
}


export interface ChatAreaProps {
  selectedUser: User | null;
  messages: Message[];
  onSendMessage: (message: string) => void;
  formatTime: (date: Date) => string;
  loading?: boolean;
  currentUserId: string;
  users?: User[]; // Add users prop
}
