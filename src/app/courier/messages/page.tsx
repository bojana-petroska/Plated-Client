'use client';
import React, { useState, useEffect } from 'react';
import NavbarCourier from '@/components/NavbarCourier';
import { useNotification } from '@/contexts/NotificationContext';

const CourierMessage = ({ orderId, userId }: { orderId: string; userId: string }) => {
  const { sendMessageToUser, listenForCourierMessages } = useNotification();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const handleIncomingMessage = (data: { orderId: string; message: string }) => {
      if (data.orderId === orderId) {
        setMessages((prev) => [...prev, `User: ${data.message}`]);
      }
    };

    listenForCourierMessages(handleIncomingMessage);
  }, [orderId, listenForCourierMessages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessageToUser(orderId, userId, message);
      setMessages((prev) => [...prev, `You: ${message}`]);
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
          className="ml-2 px-4 py-2 bg-[#8FA394] text-white rounded-2xl"
        >
          Send
        </button>
      </div>
      <NavbarCourier />
    </div>
  );
};

export default CourierMessage;
