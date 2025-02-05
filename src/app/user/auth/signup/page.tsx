'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import authService from '../../../../services/authService';
import Button from '@/components/Buttons';

const SignUp = () => {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
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
      const response = await authService.signup({ userName, email, password });
      console.log(response);

      const signInResponse = await authService.signin({ userName, password });
      const { token } = signInResponse.data.data;

      localStorage.setItem('userAuthToken', token);
      console.log('TOKEN IN HANDLE SIGN UP', token);

      router.push('/user/home');
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
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
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
            onClick={() => router.push('/user/auth/signin')}
            className="text-pink-500 hover:underline">
            Sign in!
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
