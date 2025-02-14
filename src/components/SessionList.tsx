import React from 'react';
import { MessageSquare, LogOut } from 'lucide-react';
import { useChatStore } from '../store/chatStore';

export function SessionList() {
  const { sessions, currentSessionId, createSession, setCurrentSession, logout } = useChatStore();

  return (
    <div className="w-72 border-r border-gray-200 bg-white flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-orange-500 mb-4">Ayna Chat</h1>
        <button
          onClick={createSession}
          className="w-full p-2 mb-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2"
        >
          <MessageSquare size={20} />
          New Chat
        </button>
        <button
          onClick={logout}
          className="w-full p-2 text-orange-500 border border-orange-500 rounded-lg hover:bg-orange-50 flex items-center justify-center gap-2"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {sessions.map((session) => (
          <button
            key={session.id}
            onClick={() => setCurrentSession(session.id)}
            className={`w-full p-3 text-left rounded-lg transition-colors ${
              session.id === currentSessionId
                ? 'bg-orange-100 text-orange-800'
                : 'hover:bg-gray-100'
            }`}
          >
            Chat {new Date(session.createdAt).toLocaleDateString()}
          </button>
        ))}
      </div>
    </div>
  );
}