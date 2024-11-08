'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '../../../components/AuthForm';
import authService from '@/services/authService';

type SignupData = { userName: string; email: string; password: string };
type LoginData = { userName: string; password: string };

const SignUp = () => {
  const router = useRouter();
  const [error, setError] = useState<string>('');

  const handleSignup = async (data: SignupData | LoginData) => {
    try {
      if ('email' in data) {
        const response = await authService.signup(data as SignupData);
        const { token } = response.data;
        localStorage.setItem('authToken', token);
        router.push('/home');
      } else {
        throw new Error('Invalid data type for signup');
      }
    } catch (err: unknown) {
      const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Sign up failed.';
      setError(errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
        {error && <p className="text-red-500">{error}</p>}
        <AuthForm onSubmit={handleSignup} isSignup />
      </div>
    </div>
  );
};

export default SignUp;
