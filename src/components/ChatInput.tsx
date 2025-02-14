import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useChatStore } from '../store/chatStore';

export function ChatInput() {
  const [message, setMessage] = useState('');
  const sendMessage = useChatStore((state) => state.sendMessage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    sendMessage(message);
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          type="submit"
          className="p-3 text-white bg-orange-500 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
}