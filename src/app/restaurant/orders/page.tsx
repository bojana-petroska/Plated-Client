'use client';
import React, { useEffect, useState } from 'react';
import socketService from '../../../services/socket';
import { IOrder } from '@/types';
import axiosInstance from '@/services/api/axiosInstance';
import { useRestaurant } from '@/contexts/RestaurantContext';
import NavbarRestaurant from '@/components/NavbarRestaurant';
import Button from '@/components/Buttons';

const RestaurantOrdersPage = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [activeTab, setActiveTab] = useState('pending');
  const { restaurant_id } = useRestaurant();
  console.log('Restaurant ID from context:', restaurant_id);

  useEffect(() => {
    if (!restaurant_id) return;
    console.log('Is this the real id?', restaurant_id);

    if (activeTab === 'pending') {
      const fetchRestaurant = async (restaurant_id: string) => {
        try {
          const response = await axiosInstance.get(
            `/restaurants/${restaurant_id}`
          );
          console.log('Restaurant fetch response:', response);
          console.log('Restaurant data:', response.data);
          if (response) {
            socketService.connect();
            socketService.registerRestaurant(restaurant_id);
          }
        } catch (error) {
          console.error('Failed to fetch the restaurant:', error);
        }
      };

      fetchRestaurant(restaurant_id);
    }

    console.log(orders);

    return () => {
      socketService.disconnect();
    };
  }, [restaurant_id, activeTab]);

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
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Orders</h1>
      <div className="flex space-x-4 mb-6 bg-[#F0F0F0] p-2 rounded-xl">
        <Button
          text="Pending"
          type={activeTab === 'pending' ? 'white' : 'grey'}
          onClick={() => setActiveTab('pending')}
        />
        <Button
          text="Preparing"
          type={activeTab === 'preparing' ? 'white' : 'grey'}
          onClick={() => setActiveTab('preparing')}
        />
        <Button
          text="Pick Up"
          type={activeTab === 'pick up' ? 'white' : 'grey'}
          onClick={() => setActiveTab('pick up')}
        />
      </div>
      <p>restaurant_id: {restaurant_id}</p>
      <ul className="space-y-4 text-black mb-40">
        {orders.map((order, index) => (
          <li key={index} className="bg-[#F0F0F0] rounded-xl">
            <p className="p-5 rounded-t-xl text-white font-bold bg-[#323232]">
              Order ID: {order.order_id} | Status: {order.status}
            </p>
            <p className ="mb-2 mt-2">
              <span className="p-5">
                Customer: {order.user?.firstName} {order.user?.lastName}
              </span>
            </p>
            <p className ="mb-2 mt-2">
              <span className="p-5">Address: {order.user?.address}</span>
            </p>
            <p className ="mb-2 mt-2">
              <span className="p-5">
                Date: {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </p>
            <p className="pl-5 mb-2 mt-2">
              <span >
                Items: {order.orderItems.map((item) => item.menuItem.name).join(', ')}
              </span>
            </p>
            <p className="pb-5">
              <span className="p-5">Total: {order.totalPrice} €</span>
            </p>
          </li>
        ))}
      </ul>
      <NavbarRestaurant />
    </div>
  );
};

export default RestaurantOrdersPage;
