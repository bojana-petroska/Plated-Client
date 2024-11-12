'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import authService from '@/services/authService';

const SignIn = () => {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authService.signin({ userName, password });
      console.log(response)
      console.log(response.data.success);
      const { token } = response.data.data;
      localStorage.setItem('authToken', token);
      console.log(token)
      router.push('/home');
    } catch (err) {
      console.log(err)
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Sign in failed.';
      setError(errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-6">Sign In</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSignIn} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
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
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
