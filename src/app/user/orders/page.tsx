'use client';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../services/api/axiosInstance';
import NavbarUser from '@/components/NavbarUser';
import Button from '@/components/Buttons';
import ViewOrder from '@/components/ViewOrder';
import { IOrder } from '@/types';
import { jwtDecode } from 'jwt-decode';
import socketService from '../../../services/socket';
import { useUser } from '@/contexts/UserContext';

const OrdersPage = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [activeTab, setActiveTab] = useState('history');
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [notifications, setNotifications] = useState<IOrder[]>([]);
  const { user_id, setUserId } = useUser();

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

      // const decodedToken: any = jwtDecode(token);
      // const userId = decodedToken.user_id;

      const response = await axiosInstance.get('/orders', {
        params: {
          page,
          limit: 10,
          user_id,
        },
      });
      console.log(user_id);
      const fetchedOrders = response.data.data || [];
      const totalRecords = response.data.totalItems || 0;
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

  // (should) listen for order status change from restaurant
  // when the restaurant changes the status, it isn't showing inside active tab
  useEffect(() => {
    console.log('did I start ---> useEffect');
    const token = localStorage.getItem('authToken');
    if (!token || !user_id) return;
    console.log(token);

    // const decodedToken: any = jwtDecode(token);
    // const userId = decodedToken.user_id;
    // console.log('DECODED', decodedToken)

    if (activeTab === 'current') {
      console.log(activeTab);
      socketService.connect();
      console.log('Connecting to socket!!', socketService.connect());
      
      socketService.registerUser(user_id.toString());
      console.log('Is it the correct userId:', user_id);
      console.log('userId type:', typeof(user_id));

      console.log('Socket connected:', socketService.getSocket().connected);
      socketService.listenForOrderStatusChange((order: IOrder) => {
        console.log('New order status change. Can you HEAR ME? -> Si', order);
        if (order.status === 'preparing') {
          setNotifications((prevNotifications) => [
            ...prevNotifications,
            order,
          ]);
        }
      });
    }

    return () => {
      console.log('did I just disconnect : (');
      socketService.getSocket().off('orderStatusChanged');
    };
  }, [activeTab, user_id]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">My Orders</h1>
      <div className="flex space-x-4 mb-6">
        <Button
          text="Current"
          type={activeTab === 'current' ? 'pink' : 'white'}
          onClick={() => setActiveTab('current')}
        />
        <Button
          text="History"
          type={activeTab === 'history' ? 'pink' : 'white'}
          onClick={() => setActiveTab('history')}
        />
      </div>

      {activeTab === 'current' && (
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-gray-500">No new notifications.</div>
          ) : (
            notifications.map((order) => (
              <div
                key={order.order_id}
                className="flex space-x-4 p-4 bg-gray-100 rounded-lg shadow">
                <img
                  src={order.restaurant.imageUrl || '/img/dessert.png'}
                  alt={order.restaurant.name}
                  className="w-24 h-24 rounded-[50px] object-cover"
                />

                <div className="flex-1">
                  <h2 className="text-lg font-medium">
                    {order.restaurant.name}
                  </h2>
                  <div className="text-sm text-gray-600 mb-2">
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
                  <div className="flex space-x-4">
                    <Button
                      type="pink"
                      onClick={() => viewOrder(order.order_id)}
                      text="View Order"
                      size="small"
                    />
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
                className="flex space-x-4 p-4 bg-gray-100 rounded-lg shadow">
                <img
                  src={order.restaurant.imageUrl || '/img/dessert.png'}
                  alt={order.restaurant.name}
                  className="w-24 h-24 rounded-[50px] object-cover"
                />

                <div className="flex-1">
                  <h2 className="text-lg font-medium">
                    {order.restaurant.name}
                  </h2>
                  <div className="text-sm text-gray-600 mb-2">
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
                  <div className="flex space-x-4">
                    <Button
                      type="pink"
                      onClick={() => viewOrder(order.order_id)}
                      text="View Order"
                      size="small"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {selectedOrderId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <ViewOrder orderId={selectedOrderId} onClose={closeOrderView} />
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-center items-center mt-4 space-x-4 space-y-2 pb-[80px]">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`px-2 py-1 rounded ${
              page === index + 1
                ? 'bg-pink-500 text-white'
                : 'bg-gray-200 text-gray-800'
            } hover:bg-pink-400`}
            onClick={() => handlePageClick(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>

      <NavbarUser />
    </div>
  );
};

export default OrdersPage;
