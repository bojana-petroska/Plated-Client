'use client';
import React, { useEffect, useState } from 'react';
import { IOrder, OrderStatus } from '@/types';
import { useNotification } from '@/contexts/NotificationContext';
import NavbarCourier from '@/components/NavbarCourier';
import CourierMessage from '@/components/CourierMessage';

const CourierOrdersPage = () => {
  const [notifications, setNotifications] = useState<IOrder[]>([]);
  const { registerCourier, listenForOrderStatusChange } = useNotification();
  const courier_id = localStorage.getItem('courierId');

  useEffect(() => {
    if (!courier_id) {
      console.error('No courier ID found');
      return;
    }

    registerCourier(courier_id);
    console.log('Listening for order status changes...');

    listenForOrderStatusChange((order: IOrder) => {
      console.log('New order status change received:', order);

      setNotifications((prevNotifications) => {
        const existingOrder = prevNotifications.find(
          (o) => o.order_id === order.order_id
        );

        if (existingOrder) {
          return prevNotifications.map((o) =>
            o.order_id === order.order_id ? order : o
          );
        } else {
          return [...prevNotifications, order];
        }
      });
    });

    return () => {
      console.log('Order status change listener removed');
    };
  }, [courier_id]);

  return (
    <div className="h-screen p-6 bg-[#C8D3CB]">
      <h1 className="text-xl font-semibold mb-4">My Deliveries:</h1>

      <ul className="space-y-4 text-black mb-40">
        {notifications.length === 0 ? (
          <div className="text-gray-500">No new notifications.</div>
        ) : (
          notifications.map((order, index) => (
            <li key={index} className="bg-[#F0F0F0] rounded-xl shadow-md">
              <p className="p-4 rounded-t-xl text-white font-bold bg-[#323232]">
                Order Number: {order.order_id} | Status:
                <select
                  value={order.status}
                  onChange={(e) =>
                    console.log(
                      `Update order ${order.order_id} to ${e.target.value}`
                    )
                  }
                  className="ml-2 p-1 rounded bg-[#323232] text-white border-none outline-none focus:ring-0 cursor-pointer">
                  {Object.values(OrderStatus).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </p>
              <div className="p-5">
                <h3 className="font-semibold text-lg">From:</h3>
                <p className="text-sm">
                  <strong>Restaurant:</strong> {order.restaurant.name}
                </p>
                <p className="text-sm">
                  <strong>Date:</strong>{' '}
                  {new Date(order.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="p-5 bg-gray-200 rounded-b-xl">
                <h3 className="font-semibold text-lg">Deliver to:</h3>
                <h3 className="font-semibold text-m">Client Info:</h3>
                <p className="text-sm">
                  <strong>Name:</strong> {order.user?.firstName}{' '}
                  {order.user?.lastName}
                </p>
                <p className="text-sm">
                  <strong>Address:</strong> {order.user?.address}
                </p>
                <p className="text-sm">
                  <strong>Email:</strong> {order.user?.email}
                </p>
                <p className="text-sm">
                  <strong>Phone Number:</strong> {order.user?.phoneNumber}
                </p>
              </div>

              <CourierMessage
                orderId={order.order_id}
                userId={order.user?.user_id ?? ''}
              />
            </li>
          ))
        )}
      </ul>
      <div className="pt-20">
        <NavbarCourier />
      </div>
    </div>
  );
};

export default CourierOrdersPage;
