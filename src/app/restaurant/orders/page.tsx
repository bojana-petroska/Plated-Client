'use client';

import React, { useEffect, useState } from 'react';
import socketService from '../../../services/socket';
import { IOrder } from '@/types';
import restaurantApi from '@/services/api/restaurantApi';

const RestaurantOrderNotifications = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [restaurantId, setRestaurantId] = useState<string>('');

  // useEffect(() => {
  //   const restaurantId = localStorage.getItem('restaurantId');
  //   console.log('Is this the real id?', restaurantId);
  //   if (restaurantId) {
  //     setRestaurantId(restaurantId);
  //   }
  // }, []);

  useEffect(() => {
    const restaurantId = localStorage.getItem('restaurantId');
    console.log('Is this the real id?', restaurantId);

    const fetchRestaurant = async (restaurantId: string) => {
      try {
        const response = await restaurantApi.getRestaurantById(restaurantId);
        console.log(response);
        console.log(response.data);
        if (response) {
          // Connect and register as a restaurant
          socketService.connect();
          socketService.registerClient(restaurantId);
        }
      } catch (error) {
        console.error('Failed to fetch the restaurant:', error);
      }
    };

    if (restaurantId !== null) {
      setRestaurantId(restaurantId);
      fetchRestaurant(restaurantId);
    } else {
      return;
    }

    console.log(orders);

    return () => {
      socketService.disconnect();
    };
  }, [restaurantId]);

  useEffect(() => {
    // Listen for new orders
    socketService.listenForOrderCreation((order: IOrder) => {
      setOrders((prevOrders) => [...prevOrders, order]);
    });

    return () => {
      socketService.getSocket().off('orderCreated');
    };
  }, []);

  return (
    <div>
      <h1>Restaurant Notifications</h1>
      <p>restaurant_id: {restaurantId}</p>
      <p>order:</p>
      <ul>
        {orders.map((order, index) => (
          <li key={index}>
            Order ID: {order.id}, Customer ID: {order.userId}, Items:{' '}
            {order.orderItems.map((item) => item.menuItem).join(', ')}, Total:{' '}
            {order.totalPrice}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RestaurantOrderNotifications;
