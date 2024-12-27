'use client';
import React, { useEffect, useState } from 'react';
import socketService from '../../../services/socket';
import { IOrder } from '@/types';
import axiosInstance from '@/services/api/axiosInstance';
import { useRestaurant } from '@/contexts/RestaurantContext';

const RestaurantOrderNotifications = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const { restaurant_id } = useRestaurant();
  console.log('Restaurant ID from context:', restaurant_id);

  useEffect(() => {
    if (!restaurant_id) return;
    console.log('Is this the real id?', restaurant_id);

    const fetchRestaurant = async (restaurantId: string) => {
      try {
        const response = await axiosInstance.get(`/restaurants/${restaurantId}`);
        console.log('Restaurant fetch response:', response);
        console.log('Restaurant data:', response.data);
        if (response) {
          socketService.connect();
          socketService.registerClient(restaurant_id);
        }
      } catch (error) {
        console.error('Failed to fetch the restaurant:', error);
      }
    };

    fetchRestaurant(restaurant_id);

    console.log(orders);

    return () => {
      socketService.disconnect();
    };
  }, [restaurant_id]);

  useEffect(() => {
    console.log('Socket connected:', socketService.getSocket().connected);
    socketService.listenForOrderCreation((order: IOrder) => {
      console.log('New order received:', order);
      setOrders((prevOrders) => [...prevOrders, order]);
    });

    return () => {
      socketService.getSocket().off('orderCreated');
    };
  }, []);

  return (
    <div>
      <h1>Restaurant Notifications</h1>
      <p>restaurant_id: {restaurant_id}</p>
      <p>order:</p>
      <ul>
        {orders.map((order, index) => (
          <li key={index}>
            Order ID: {order.order_id}, Customer ID: {order.user?.userName}, Items:{' '}
            {order.orderItems.map((item) => item.menuItem).join(', ')}, Total:{' '}
            {order.totalPrice}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RestaurantOrderNotifications;
