export interface SignUpForm {
  name: string;
  email: string;
  password: string;
}

export interface SignInForm {
  email: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  status: "online" | "offline";
  lastSeen: Date;
  avatarUrl?: string;
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
}

export interface ChatAreaProps {
  selectedUser: User | null;
  messages: Message[];
  onSendMessage: (message: string) => void;
  formatTime: (date: Date) => string;
}
