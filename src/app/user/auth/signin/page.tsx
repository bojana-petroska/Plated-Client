'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import authService from '../../../../services/authService';
import Button from '@/components/Buttons';

const SignIn = () => {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authService.signin({ userName, password });
      console.log(response);
      console.log(response.data.success);
      const { token, refreshToken } = response.data.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('refreshToken', refreshToken);

      console.log('TOKEN FROM HANDLE SIGN IN', token);
      router.push('/user/home');
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
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
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
            onClick={() => router.push('/user/auth/signup')}
            className="text-pink-500 hover:underline">
            Sign up!
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
