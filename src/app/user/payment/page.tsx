'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from '@stripe/react-stripe-js';
import axiosInstance from '@/services/api/axiosInstance';
import Button from '@/components/Buttons';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { IUser } from '@/types';
import { useCart } from '@/contexts/CartContext';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const PaymentPage = () => {
  const [stripeLoaded, setStripeLoaded] = useState(false);

  useEffect(() => {
    stripePromise.then(() => setStripeLoaded(true));
  }, []);

  return (
    <Elements stripe={stripePromise}>
      {stripeLoaded && <CheckoutForm />}
    </Elements>
  );
};

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const searchParams = useSearchParams();
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState('');
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const { cart, clearCart } = useCart();

  const { restaurant_id } = useRestaurant();

  const userId = localStorage.getItem('userId');
  console.log('Check for userId:', userId);

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

      clearCart();
      localStorage.removeItem('cart');

      router.push(`/user/payment?amount=${total}`);
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  useEffect(() => {
    const amountFromQuery = searchParams.get('amount');
    if (amountFromQuery) {
      setAmount(Number(amountFromQuery));
    }
  }, [searchParams]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await handleOrderCreation();

    if (!stripe || !elements) return;

    const roundedAmount = Math.round(amount * 100);
    console.log('Rounded Amount:', roundedAmount);

    try {
      const response = await axiosInstance.post('/payments/create-payment', {
        amount: roundedAmount,
        currency: 'eur',
        userId,
      });

      console.log('Payment API response:', response.data);

      const { clientSecret } = response.data;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        setMessage(result.error.message || 'Payment failed.');
      } else {
        setMessage('Payment successful!');
        setPaymentSuccessful(true);
      }
    } catch (error) {
      setMessage('Payment failed. Please try again.');
      console.error('Payment error:', error);
    }
  };

  useEffect(() => {
    if (paymentSuccessful) {
      setTimeout(() => {
        router.push('/user/orders');
      }, 2000);
    }
  }, [paymentSuccessful, router]);

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-screen">
      {paymentSuccessful ? (
        <div className="text-center p-6 bg-[#FF7F7F] text-white rounded-lg shadow-lg max-w-lg mx-auto">
          <h2 className="text-xl font-semibold">
            Thank you for your purchase!
          </h2>
          <p className="mt-2">
            Your payment was successful. We will process your order shortly.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          className="w-full bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Complete Your Payment</h1>
          <p className="text-lg mb-6">Total: €{amount.toFixed(2)}</p>
          <div className="mb-4">
            <CardElement
              className="w-full border p-3 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              options={{
                hidePostalCode: true,
                style: {
                  base: {
                    color: '#32325d',
                    fontSize: '16px',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                },
              }}
              autoComplete="new-password"
              name="payment-method"
            />
          </div>
          <Button
            onClick={handleSubmit}
            type="pink"
            text="Pay"
            size="default"
          />
          <p className="text-center text-red-500 mt-4">{message}</p>
        </form>
      )}
    </div>
  );
};

export default PaymentPage;
