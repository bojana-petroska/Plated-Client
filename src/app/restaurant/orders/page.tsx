'use client';
import React, { useEffect, useState } from 'react';
import socketService from '../../../services/socket';
import { IOrder, OrderStatus } from '@/types';
import axiosInstance from '@/services/api/axiosInstance';
import { useRestaurant } from '@/contexts/RestaurantContext';
import NavbarRestaurant from '@/components/NavbarRestaurant';
import Button from '@/components/Buttons';
import { useNotification } from '@/contexts/NotificationContext';

const RestaurantOrdersPage = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [activeTab, setActiveTab] = useState('pending');
  const { restaurant_id } = useRestaurant();
  const { registerRestaurant, listenForOrderCreation } = useNotification();
  const [restaurantName, setRestaurantName] = useState<string>('');
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
          console.log('Restaurant data:', response.data);
          if (response) {
            registerRestaurant(restaurant_id);
            console.log('Restaurant fetch response:', response);
            setRestaurantName(response.data.name);
          }
        } catch (error) {
          console.error('Failed to fetch the restaurant:', error);
        }
      };

      fetchRestaurant(restaurant_id);
    }
  }, [restaurant_id, activeTab]);

  useEffect(() => {
    console.log('Socket connected:', socketService.getSocket().connected);
    listenForOrderCreation((order: IOrder) => {
      console.log('New order received:', order);
      setOrders((prevOrders) => {
        const existingOrder = prevOrders.find(
          (o) => o.order_id === order.order_id
        );
        if (existingOrder) {
          return prevOrders.map((o) =>
            o.order_id === order.order_id ? order : o
          );
        } else {
          return [...prevOrders, order];
        }
      });
    });

    return () => {
      // socketService.getSocket().off('orderCreated');
      console.log('Order creation listener removed');
    };
  }, []);

  const handleStatusChange = async (
    order_id: number,
    newStatus: OrderStatus
  ) => {
    if (!order_id) {
      console.error('Invalid order_id:', order_id);
      return;
    }

    try {
      console.log('Order before status change:', order_id);
      const response = await axiosInstance.put(
        `/restaurants/${restaurant_id}/${order_id}/status`,
        {
          status: newStatus,
        }
      );
      console.log('Order status updated:', response);
      if (response.status === 201) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.order_id === order_id
              ? { ...order, status: newStatus }
              : order
          )
        );

        if (newStatus !== activeTab) {
          console.log('DO YOU LISTEN TO ME -> YES');
          setActiveTab(newStatus);
        }
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        My Orders: {restaurantName}
      </h1>
      <div className="flex space-x-4 mb-6 bg-[#F0F0F0] p-2 rounded-xl">
        {Object.values(OrderStatus).map((status) => (
          <Button
            key={status}
            text={status}
            type={activeTab === status ? 'white' : 'grey'}
            onClick={() => setActiveTab(status)}
          />
        ))}
      </div>

      <ul className="space-y-4 text-black mb-40">
        {orders.map((order, index) => (
          <li
            key={index}
            className={`bg-[#F0F0F0] rounded-xl ${
              order.status === activeTab ? 'block' : 'hidden'
            }`}>
            <p className="p-5 rounded-t-xl text-white font-bold bg-[#323232]">
              Order Number: {order.order_id} | Status:
              <select
                value={order.status}
                onChange={(e) =>
                  handleStatusChange(
                    order?.order_id,
                    e.target.value as OrderStatus
                  )
                }
                className="ml-2 p-1 rounded bg-[#323232] text-white">
                {Object.values(OrderStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </p>
            <p className="mb-2 mt-2">
              <span className="p-5">
                Customer: {order.user?.firstName} {order.user?.lastName}
              </span>
            </p>
            <p className="mb-2 mt-2">
              <span className="p-5">Address: {order.user?.address}</span>
            </p>
            <p className="mb-2 mt-2">
              <span className="p-5">
                Date: {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </p>
            <p className="pl-5 mb-2 mt-2">
              <span>
                Items:{' '}
                {order.orderItems.map((item) => item.menuItem.name).join(', ')}
              </span>
            </p>
            <p className="pb-5">
              <span className="p-5">
                Total: {order.totalPrice.toFixed(2)} €
              </span>
            </p>
          </li>
        ))}
      </ul>
      <NavbarRestaurant />
    </div>
  );
};

export default RestaurantOrdersPage;
