'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import authService from '../../../../services/authService';
import Button from '@/components/Buttons';
import { jwtDecode } from 'jwt-decode';
import { useUser } from '@/contexts/UserContext';

const SignIn = () => {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUserId } = useUser();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authService.signin({ userName, password });
      console.log(response);
      console.log(response.data.success);
      const { token, refreshToken } = response.data.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('refreshToken', refreshToken);

      const decodedToken: any = jwtDecode(token);
      localStorage.setItem('userId', decodedToken.user_id);

      setUserId(decodedToken.user_id);
      console.log('User ID from CONTEXT:', setUserId(decodedToken.user_id));

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
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="w-full max-w-sm p-8">
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSignIn} className="space-y-6">
          <div>
            <p className="py-1">Username</p>
            <input
              type="text"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-[15px] focus:ring-1 focus:ring-[#FF7F7F] focus:outline-none"
            />
          </div>
          <div>
            <p className="py-1">Password</p>
            <input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-[15px] focus:ring-1 focus:ring-[#FF7F7F] focus:outline-none"
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
          <Button text="Sign in" type="pink" onClick={() => {}} />
          </div>
        </form>
        <p className="text-center mt-6 text-sm text-gray-500">
          Don’t have an account?{' '}
          <button
            onClick={() => router.push('/user/auth/signup')}
            className="text-gray-500 underline">
            Sign up!
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
