export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'server';
  timestamp: number;
}

export interface User {
  email: string;
  username: string;
  password: string;
}

export interface ChatSession {
  id: string;
  messages: Message[];
  createdAt: number;
}

export interface AuthUser {
  email: string;
  username: string;
  isAuthenticated: boolean;
}