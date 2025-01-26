'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import restaurantAuthService from '../../../../services/authRestaurantService';
import { useRestaurant } from '@/contexts/RestaurantContext';
import Button from '@/components/Buttons';

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
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-md">
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            type="text"
            placeholder="Restaurant Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-400"
          />
          <Button text="Sign up" type="pink" onClick={() => {}} />
        </form>
        <p className="text-center mt-6 text-sm text-gray-500">
          Already have an account?{' '}
          <button
            onClick={() => router.push('/restaurant/auth/signin')}
            className="text-pink-500 hover:underline">
            Sign in!
          </button>
        </p>
      </div>
    </div>
  );
};

export default RestaurantSignUpPage;
