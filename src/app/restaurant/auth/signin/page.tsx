'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import restaurantAuthService from '../../../../services/authRestaurantService';
import { useRestaurant } from '@/contexts/RestaurantContext';
import Button from '@/components/Buttons';

const RestaurantSignInPage = () => {
  const router = useRouter();
  const { setRestaurantId } = useRestaurant();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await restaurantAuthService.signin({ name, password });
      console.log(response);
      console.log(response.data.success);
      const { token, refreshToken, restaurant_id } = response.data.data;

      localStorage.setItem('restaurantAuthToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('restaurant_id', restaurant_id);

      setRestaurantId(restaurant_id);
      console.log('Restaurant ID from sign-IN:', restaurant_id);

      console.log('TOKEN FROM HANDLE SIGN IN', token);
      router.push('/restaurant/orders');
    } catch (err) {
      console.log(err);
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Sign in failed.';
      setError(errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-md">
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSignIn} className="space-y-6">
          <input
            type="text"
            placeholder="Restaurant Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-[15px] focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-[15px] focus:ring-2 focus:ring-pink-400"
          />
          <div className="flex justify-between items-center text-sm text-gray-500">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span>Remember me</span>
            </label>
            <button type="button" className="hover:underline">
              Forgot password?
            </button>
          </div>
          <Button text="Sign in" type="pink" onClick={() => {}} />
        </form>
        <p className="text-center mt-6 text-sm text-gray-500">
          Don’t have an account?{' '}
          <button
            onClick={() => router.push('/restaurant/auth/signup')}
            className="text-pink-500 hover:underline">
            Sign up!
          </button>
        </p>
      </div>
    </div>
  );
};

export default RestaurantSignInPage;
