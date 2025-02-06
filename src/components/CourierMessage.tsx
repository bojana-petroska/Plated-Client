'use client';
import React, { useState } from 'react';
import { useNotification } from '@/contexts/NotificationContext';

const CourierMessage = ({
  orderId,
  userId,
}: {
  orderId: string;
  userId: string;
}) => {
  const { sendMessageToUser } = useNotification();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log(`Sending message: ${message} to user: ${userId} for order: ${orderId}`);
      sendMessageToUser(orderId, userId, message);
      setMessages((prev) => [...prev, message]);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col p-4 ">
      <div className="flex-1 overflow-y-auto border p-4 rounded-lg ">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2 p-2 bg-gray-200 rounded-lg">
            {msg}
          </div>
        ))}
      </div>
      <div className="flex mt-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Send an update to the user"
          className="flex-1 p-2 border rounded-2xl"
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 px-4 py-2 bg-[#8FA394] text-white rounded-2xl">
          Send
        </button>
      </div>
    </div>
  );
};

export default CourierMessage;
