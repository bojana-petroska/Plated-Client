'use client';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../services/api/axiosInstance';
import NavbarUser from '@/components/NavbarUser';
import ViewOrder from '@/components/ViewOrder';
import { IOrder } from '@/types';
import socketService from '../../../services/socket';
import { useUser } from '@/contexts/UserContext';
import { useNotification } from '@/contexts/NotificationContext';

const OrdersPage = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [activeTab, setActiveTab] = useState('history');
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [notifications, setNotifications] = useState<IOrder[]>([]);
  const { user_id, setUserId } = useUser();
  const { registerUser, listenForOrderStatusChange } = useNotification();

  if (!user_id) {
    return <div>Loading user data...</div>;
  }

  useEffect(() => {
    if (activeTab === 'history') {
      fetchOrders();
    }
  }, [activeTab, page, user_id]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found.');
        return;
      }

      const response = await axiosInstance.get('/orders', {
        params: {
          page,
          limit: 10,
          user_id,
        },
      });
      const fetchedOrders = response.data.data || [];
      const totalRecords = response.data.totalItems || 0;
      registerUser(user_id);
      setOrders(fetchedOrders);
      setTotalPages(Math.ceil(totalRecords / 10));
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const viewOrder = (orderId: number) => {
    setSelectedOrderId(orderId);
  };

  const closeOrderView = () => {
    setSelectedOrderId(null);
  };

  const handlePageClick = (pageNumber: number) => {
    setPage(pageNumber);
  };

  useEffect(() => {
    console.log('Socket connected:', socketService.getSocket().connected);

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
      // socketService.getSocket().off('orderStatusChanged');
    };
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">My Orders</h1>
      <div className="flex space-x-4 mb-6 border-[1px] border-dark-gray rounded-xl p-1">
        <button
          onClick={() => setActiveTab('current')}
          className={`flex-1 text-center px-4 py-2 rounded-lg ${activeTab === 'current' ? 'bg-[#FF7F7F]/15 text-[#FF7F7F]' : 'text-gray-500'}`}>
          {' '}
          Current{' '}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 text-center px-4 py-2 rounded-lg ${activeTab === 'history' ? 'bg-[#FF7F7F]/15 text-[#FF7F7F]' : 'text-gray-500'}`}>
          History
        </button>
      </div>

      {activeTab === 'current' && (
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="flex justify-center items-center text-gray-500">No new notifications.</div>
          ) : (
            notifications.map((order, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 bg-gray-100 rounded-[55px] shadow max-w-2xl">
                <img
                  src={order.restaurant.imageUrl || '/img/dessert.png'}
                  alt={order.restaurant.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex flex-col space-y-2">
                  <div className="p-3 rounded-lg max-w-sm">
                    <h2 className="text-m font-medium pb-4">
                      {`Thank you for your order! We are preparing it now!`}
                    </h2>
                    <p className="text-xs text-gray-600">
                      From: {order.restaurant.name}
                    </p>
                    <p className="text-xs text-gray-600 mb-2">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => viewOrder(order.order_id)}
                      className="px-10 py-2 border border-[#FF7F7F] text-[#FF7F7F] rounded-[15px] transition duration-300 hover:bg-[#FF7F7F] hover:text-white">
                      View Order
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-gray-500">No orders found.</div>
          ) : (
            orders.map((order) => (
              <div
                key={order.order_id}
                className="flex items-center space-x-12 p-4 bg-gray-100 rounded-[15px] shadow">
                <div className="pl-10 w-52 h-28 flex justify-center items-center">
                  <img
                    src={order.restaurant.imageUrl || '/img/dessert.png'}
                    alt={order.restaurant.name}
                    className="w-full h-full object-cover rounded-[15px]"
                  />
                </div>

                <div className="flex-1">
                  <h2 className="text-l font-medium mb-2">
                    {order.restaurant.name}
                  </h2>
                  <div className="text-sm text-gray-600 mb-4">
                    <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                    <p>
                      {order.orderItems.reduce(
                        (total, item) => total + item.quantity,
                        0
                      )}{' '}
                      items
                    </p>
                    <p>{order.totalPrice.toFixed(2)} €</p>
                  </div>
                  <button
                    onClick={() => viewOrder(order.order_id)}
                    className="px-10 py-2 border border-[#FF7F7F] text-[#FF7F7F] rounded-[15px] transition duration-300 hover:bg-[#FF7F7F] hover:text-white">
                    View Order
                  </button>
                </div>
              </div>
            ))
          )}
          <div className="flex flex-wrap justify-center items-center mt-4 space-x-4 pb-[80px]">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`px-2 py-1 rounded ${
                  page === index + 1
                    ? 'bg-[#FF7F7F]/15 text-[#FF7F7F]'
                    : 'text-gray-800'
                } hover:bg-[#FF7F7F]/15 hover:text-[#FF7F7F]`}
                onClick={() => handlePageClick(index + 1)}>
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedOrderId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <ViewOrder orderId={selectedOrderId} onClose={closeOrderView} />
          </div>
        </div>
      )}
      <NavbarUser />
    </div>
  );
};

export default OrdersPage;
