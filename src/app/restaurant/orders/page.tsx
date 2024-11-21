'use client';

import React, { useEffect, useState } from 'react';
import socketService from '../../../services/socket';
import { IOrder } from '@/types';

const RestaurantOrderNotifications = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);

  useEffect(() => {
    const restaurantId = '123456'
    // Connect and register as a restaurant
    socketService.connect();
    socketService.registerClient('restaurant', restaurantId); // Replace with actual ID

    // Listen for new orders
    socketService.listenForOrderCreation((order: IOrder) => {
      setOrders((prevOrders) => [...prevOrders, order]);
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Restaurant Notifications</h1>
      <ul>
        {orders.map((order, index) => (
          <li key={index}>Order ID: {order.id}, Total: {order.totalPrice}</li>
        ))}
      </ul>
    </div>
  );
};

export default RestaurantOrderNotifications;
