import React, { useEffect } from 'react';
import { Auth } from './components/Auth';
import { ChatInput } from './components/ChatInput';
import { ChatMessages } from './components/ChatMessages';
import { SessionList } from './components/SessionList';
import { useChatStore } from './store/chatStore';

function App() {
  const { user, connect, disconnect } = useChatStore();

  useEffect(() => {
    if (user?.isAuthenticated) {
      connect();
    }
    return () => disconnect();
  }, [user?.isAuthenticated]);

  if (!user?.isAuthenticated) {
    return <Auth />;
  }

  return (
    <div className="flex h-screen bg-white">
      <SessionList />
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold">Welcome, {user.username}</h1>
        </div>
        <ChatMessages />
        <ChatInput />
      </div>
    </div>
  );
}

export default App;