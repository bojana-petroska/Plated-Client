'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '../../../services/api/axiosInstance';

const CourierSignIn = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/courier/signin', {
        name,
        email,
      });
      console.log(response.data);
      if (!response.data) throw new Error('Courier not found');

      const { courier_id } = response.data;
      localStorage.setItem('courierId', courier_id);

      router.push('/courier/orders');
    } catch (err) {
      console.log(err);
      setError('Sign in failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="w-full max-w-sm p-8">
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSignIn} className="space-y-6">
          <div>
            <p className="py-2">Name</p>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#EFF2EF] border-none border rounded-[15px] focus:ring-1 focus:ring-[#8FA394] focus:outline-none"
            />
          </div>
          <div>
            <p className="py-2">Email</p>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#EFF2EF] border-none border rounded-[15px] focus:ring-1 focus:ring-[#8FA394] focus:outline-none"
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
              onClick={() => router.push('/courier/orders')}
              className="w-full py-3 rounded-[15px] transition duration-300 bg-[#6B9FDC] text-white hover:bg-[#6B9FDC]/80 border-none">
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourierSignIn;
