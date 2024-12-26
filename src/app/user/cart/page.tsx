'use client';
import React from 'react';
import { useCart } from '@/contexts/CartContext';
import Button from '@/components/Buttons';

const CartPage = () => {
  const { cart, totalQuantity, updateItemQuantity } = useCart();

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

  return (
    <div className="container mx-auto mt-10">
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
            onClick={() => console.log('Proceeding to PayPal...')}
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
