'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import restaurantAuthService from '../../../../services/authRestaurantService';
import { useRestaurant } from '@/contexts/RestaurantContext';

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

      localStorage.setItem('authToken', token);
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
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="w-full max-w-sm p-8">
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSignIn} className="space-y-6">
          <div>
            <p className="py-2">Restaurant Name</p>
            <input
              type="text"
              placeholder="Your Restaurant Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-[#A5C5DF]/30 w-full px-4 py-3 border rounded-[15px] focus:ring-2 focus:ring-[#A5C5DF] border-none text-[#8A8A8A] focus:outline-none"
            />
          </div>
          <div>
            <p className="py-2">Password</p>
            <input
              type="password"
              placeholder="Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-[#A5C5DF]/30 w-full px-4 py-3 border rounded-[15px] focus:ring-2 focus:ring-[#A5C5DF] border-none text-[#8A8A8A] focus:outline-none"
            />
          </div>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span>Remember me</span>
            </label>
            <button type="button" className="hover:underline">
              Forgot password?
            </button>
          </div>
          <div className="pt-20">
            <button
              onClick={() => router.push('/restaurant/orders')}
              className="w-full py-3 rounded-[15px] transition duration-300 bg-[#6B9FDC] text-white hover:bg-[#6B9FDC]/80 border-none">
              Sign In
            </button>
          </div>
        </form>
        <p className="text-center mt-6 text-sm text-gray-500">
          Don’t have an account?{' '}
          <button
            onClick={() => router.push('/restaurant/auth/signup')}
            className="text-gray-500 underline">
            Sign up!
          </button>
        </p>
      </div>
    </div>
  );
};

export default RestaurantSignInPage;
