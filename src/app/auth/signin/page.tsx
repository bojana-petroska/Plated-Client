'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import AuthForm from '../../../components/AuthForm';
import authService from '@/services/authService';

const SignIn = () => {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleLogin = async (data: { username: string; password: string }) => {
    try {
      const response = await authService.login(data);
      const { token } = response.data;
      localStorage.setItem('authToken', token);
      router.push('/home');
    } catch (err: unknown) {
      const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Sign up failed.';
      setError(errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-6">Log In</h2>
        {error && <p className="text-red-500">{error}</p>}
        <AuthForm onSubmit={handleLogin} />
      </div>
    </div>
  );
};

export default SignIn;
