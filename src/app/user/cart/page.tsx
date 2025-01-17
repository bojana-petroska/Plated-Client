'use client';
import React, { useEffect, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import Button from '@/components/Buttons';
import axiosInstance from '@/services/api/axiosInstance';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { IUser } from '@/types';

const CartPage = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const { cart, totalQuantity, updateItemQuantity } = useCart();
  const { restaurant_id } = useRestaurant();
  console.log('Restaurant ID FROM CONTEXT IN CART PAGE:', restaurant_id);
  const [alertVisible, setAlertVisible] = useState(false);

  const handleUpdateQuantity = (
    id: number | undefined,
    action: 'increase' | 'decrease'
  ) => {
    if (id !== undefined) {
      updateItemQuantity(id, action);
    }
    console.log('AM I CLICKED?');
  };

  const total = cart.reduce((acc, item) => {
    if (item.menuItem && item.menuItem.price) {
      return acc + item.menuItem.price * item.quantity;
    }
    return acc;
  }, 0);

  const handleOrderCreation = async () => {
    if (!restaurant_id) {
      throw new Error('Restaurant ID not found');
    }

    try {
      const response = await axiosInstance.post('/orders', {
        userName: user?.userName,
        restaurant_id: restaurant_id,
        orderItems: cart.map((item) => ({
          menuItem: item.menuItem,
          quantity: item.quantity,
        })),
      });

      console.log('Order created:', response.data);

      setAlertVisible(true);
      setTimeout(() => {
        setAlertVisible(false);
      }, 4000);
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get('/users/profile');
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } 
    };

    fetchUserData();
  }, []);
console.log(user)
  return (
    <div className="container mx-auto mt-10">
      {alertVisible && (
        <div className="alert alert-success p-4 mb-4 bg-green-500 text-white rounded">
          Order Created Successfully!
        </div>
      )}
      <div className="fixed top-4 right-4 bg-green-500 text-white rounded-full flex items-center justify-center p-3 z-50">
        <span className="font-bold">{totalQuantity}</span>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-lg">
        {cart.map((item, index) => (
          <div
            key={`${item.menuItem?.menuItem_id}-${index}`}
            className="border-b border-gray-300 py-4">
            <div className="flex justify-between">
              <span className="font-semibold text-lg">
                {item.menuItem?.name}
              </span>
              <span className="text-gray-700">
                €{(item.menuItem?.price * item.quantity).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between mt-2 items-center bg-gray-100 rounded-lg p-2">
              <button
                className="text-xl text-gray-700"
                onClick={() =>
                  handleUpdateQuantity(item.menuItem?.menuItem_id, 'decrease')
                }>
                -
              </button>
              <span className="font-semibold">{item.quantity}</span>
              <button
                className="text-xl text-gray-700"
                onClick={() =>
                  handleUpdateQuantity(item.menuItem?.menuItem_id, 'increase')
                }>
                +
              </button>
            </div>
          </div>
        ))}

        <div className="mt-6 flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>€{total.toFixed(2)}</span>
        </div>

        <div className="mt-6">
          <Button
            onClick={handleOrderCreation}
            text="Pay with PayPal"
            type="pink"
            size="default"
          />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
