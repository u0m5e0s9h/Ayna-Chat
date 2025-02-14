import { create } from 'zustand';
import type { Message, User, ChatSession, AuthUser } from '../types/chat';

interface ChatStore {
  user: AuthUser | null;
  sessions: ChatSession[];
  currentSessionId: string | null;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (content: string) => void;
  createSession: () => void;
  setCurrentSession: (sessionId: string) => void;
  addMessage: (message: Message) => void;
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string) => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  user: null,
  sessions: [],
  currentSessionId: null,

  connect: () => {
    const storedSessions = localStorage.getItem('chat_sessions');
    if (storedSessions) {
      set({ sessions: JSON.parse(storedSessions) });
    }
  },

  disconnect: () => {
    const { sessions } = get();
    localStorage.setItem('chat_sessions', JSON.stringify(sessions));
  },

  sendMessage: (content: string) => {
    const { currentSessionId } = get();
    if (!currentSessionId) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content,
      sender: 'user',
      timestamp: Date.now(),
    };

    get().addMessage(userMessage);

    // Simulate server response
    setTimeout(() => {
      const serverMessage: Message = {
        id: crypto.randomUUID(),
        content,
        sender: 'server',
        timestamp: Date.now(),
      };
      get().addMessage(serverMessage);
    }, 500);
  },

  createSession: () => {
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      messages: [],
      createdAt: Date.now(),
    };

    set((state) => ({
      sessions: [...state.sessions, newSession],
      currentSessionId: newSession.id,
    }));
  },

  setCurrentSession: (sessionId: string) => {
    set({ currentSessionId: sessionId });
  },

  addMessage: (message: Message) => {
    set((state) => {
      const sessionIndex = state.sessions.findIndex(
        (s) => s.id === state.currentSessionId
      );

      if (sessionIndex === -1) return state;

      const newSessions = [...state.sessions];
      newSessions[sessionIndex] = {
        ...newSessions[sessionIndex],
        messages: [...newSessions[sessionIndex].messages, message],
      };

      localStorage.setItem('chat_sessions', JSON.stringify(newSessions));
      return { sessions: newSessions };
    });
  },

  logout: () => {
    localStorage.removeItem('auth_user');
    set({ user: null, sessions: [], currentSessionId: null });
  },

  login: async (email: string, password: string) => {
    const usersStr = localStorage.getItem('users') || '[]';
    const users: User[] = JSON.parse(usersStr);
    
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const authUser: AuthUser = {
      email: user.email,
      username: user.username,
      isAuthenticated: true
    };

    localStorage.setItem('auth_user', JSON.stringify(authUser));
    set({ user: authUser });
  },

  signup: async (email: string, username: string, password: string) => {
    const usersStr = localStorage.getItem('users') || '[]';
    const users: User[] = JSON.parse(usersStr);
    
    if (users.some(u => u.email === email)) {
      throw new Error('Email already exists');
    }

    const newUser: User = { email, username, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    const authUser: AuthUser = {
      email,
      username,
      isAuthenticated: true
    };

    localStorage.setItem('auth_user', JSON.stringify(authUser));
    set({ user: authUser });
  },
}));