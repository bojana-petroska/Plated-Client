'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '../../../services/api/axiosInstance';
import Button from '@/components/Buttons';

const CourierSignIn = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/courier/signin', { name, email });
      console.log(response.data);
      if (!response.data) throw new Error('Courier not found');

      const { courier_id } = response.data;
      localStorage.setItem('courierId', courier_id);

      router.push('/courier/profile');
    } catch (err) {
      console.log(err);
      setError('Sign in failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-md">
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSignIn} className="space-y-6">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-[15px] focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-[15px] focus:ring-2 focus:ring-pink-400"
          />
          <Button text="Sign in" type="pink" onClick={() => {}} />
        </form>
        {/* <p className="text-center mt-6 text-sm text-gray-500">
          Need an account?{' '}
          <button
            onClick={() => router.push('/courier/auth/signup')}
            className="text-pink-500 hover:underline">
            Sign up!
          </button>
        </p> */}
      </div>
    </div>
  );
};

export default CourierSignIn;
