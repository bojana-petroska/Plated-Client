'use client';
import axiosInstance from '@/services/api/axiosInstance';
import { IOrder } from '@/types';
import React, { useState, useEffect } from 'react';
import Button from './Buttons';
import { useCart } from '@/contexts/CartContext';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { useRouter } from 'next/navigation';

interface ViewOrderProps {
  orderId: number;
  onClose: () => void;
}

const ViewOrder: React.FC<ViewOrderProps> = ({ orderId, onClose }) => {
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { setCart } = useCart();
  const { restaurant_id, setRestaurantId } = useRestaurant();

  console.log('RESTAURANT ID FROM CONTEXT IN VIEW ORDER', restaurant_id);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      console.log('Fetching order with ID:', orderId);

      try {
        const response = await axiosInstance.get(`/orders/${orderId}`);
        console.log('Fetched order response:', response);

        const data: IOrder = await response.data;
        setOrder(data);
      } catch (err: unknown) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleOrderAgain = (order: IOrder | null) => {
    if (order && order.orderItems?.length) {
      const cartItems = order.orderItems.map((item) => ({
        menuItem: item.menuItem,
        quantity: item.quantity,
        restaurant_id: order.restaurant?.restaurant_id ?? null,
      }));
      setCart(cartItems);

      if (order.restaurant?.restaurant_id) {
        setRestaurantId(order.restaurant.restaurant_id.toString());
      } else {
        console.error('Restaurant ID is undefined');
      }

      router.push('/user/cart');
    }
  };

  useEffect(() => {
    console.log('Updated order:', order);
  }, [order]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!order) return <div>No order details available.</div>;

  return (
    <div className="p-4 border rounded shadow">
      <button onClick={onClose} className="mb-4 text-red-500">
        Close
      </button>
      <h2 className="text-xl font-bold mb-2">Order Details</h2>
      <p>
        <strong>Status:</strong> {order.status}
      </p>
      <p>
        <strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}
      </p>
      <p>
        <strong>Created At:</strong>{' '}
        {new Date(order.createdAt).toLocaleString()}
      </p>
      <h3 className="mt-4 text-lg font-semibold">Order Items</h3>
      <ul>
        {order.orderItems.map((item, index) => (
          <li key={index} className="mb-2">
            {item.menuItem.name} - ${item.menuItem.price.toFixed(2)} x{' '}
            {item.quantity}
          </li>
        ))}
      </ul>
      <Button
        onClick={() => handleOrderAgain(order)}
        text="Order Again"
        type="white"
        size="default"
      />
    </div>
  );
};

export default ViewOrder;
