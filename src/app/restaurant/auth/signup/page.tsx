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
  const [error, setError] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

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
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input-class"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-class"
          />
          <button type="submit" className="btn-class">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default RestaurantSignUpPage;
