import React, { useEffect, useRef } from 'react';
import { useChatStore } from '../store/chatStore';

export function ChatMessages() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentSessionId = useChatStore((state) => state.currentSessionId);
  const sessions = useChatStore((state) => state.sessions);
  
  const currentSession = sessions.find((s) => s.id === currentSessionId);
  const messages = currentSession?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-orange-50">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.sender === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[70%] p-3 rounded-lg ${
              message.sender === 'user'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-800 shadow-sm'
            }`}
          >
            <p>{message.content}</p>
            <span className="text-xs opacity-75">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}