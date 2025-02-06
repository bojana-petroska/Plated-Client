'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import restaurantAuthService from '../../../../services/authRestaurantService';
import { useRestaurant } from '@/contexts/RestaurantContext';

const RestaurantSignUpPage = () => {
  const router = useRouter();
  const { setRestaurantId } = useRestaurant();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== repeatPassword) {
      setError('Passwords do not match!');
      return;
    }

    try {
      const signUpResponse = await restaurantAuthService.signup({
        name,
        password,
      });
      console.log('Sign up response:', signUpResponse);

      const signInResponse = await restaurantAuthService.signin({
        name,
        password,
      });
      const { token, restaurant_id } = signInResponse.data.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('restaurant_id', restaurant_id);
      console.log('TOKEN IN HANDLE SIGN UP', token);

      setRestaurantId(restaurant_id);
      console.log('Restaurant ID from sign-up:', restaurant_id);

      router.push('/restaurant/home');
    } catch (err) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Sign up failed.';
      setError(errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="w-full max-w-sm p-8">
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSignUp} className="space-y-6">
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
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-[#A5C5DF]/30 w-full px-4 py-3 border rounded-[15px] focus:ring-2 focus:ring-[#A5C5DF] border-none text-[#8A8A8A] focus:outline-none"
            />
          </div>
          <div>
            <p className="py-2">Confirm Password</p>
            <input
              type="password"
              placeholder="Confirm password"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              required
              className="bg-[#A5C5DF]/30 w-full px-4 py-3 border rounded-[15px] focus:ring-2 focus:ring-[#A5C5DF] border-none text-[#8A8A8A] focus:outline-none"
            />
          </div>
          <div className="pt-20">
            <button
              onClick={() => router.push('/restaurant/orders')}
              className="w-full py-3 rounded-[15px] transition duration-300 bg-[#6B9FDC] text-white hover:bg-[#6B9FDC]/80 border-none">
              Sign Up
            </button>
          </div>
        </form>
        <p className="text-center mt-6 text-sm text-gray-500">
          Already have an account?{' '}
          <button
            onClick={() => router.push('/restaurant/auth/signin')}
            className="text-gray-500 underline">
            Sign in!
          </button>
        </p>
      </div>
    </div>
  );
};

export default RestaurantSignUpPage;
