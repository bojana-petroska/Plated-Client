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

      localStorage.setItem('authToken', token);
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
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="w-full max-w-sm p-8">
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <p className="py-2">Email</p>
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-[15px] focus:ring-1 focus:ring-[#FF7F7F] focus:outline-none"
            />
          </div>
          <div>
            <p className="py-2">Username</p>
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
            <p className="py-2">Password</p>
            <input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-[15px] focus:ring-1 focus:ring-[#FF7F7F] focus:outline-none"
            />
          </div>
          <div>
            <p className="py-2">Confirm password</p>
            <input
              type="password"
              placeholder="Your Password"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-[15px] focus:ring-1 focus:ring-[#FF7F7F] focus:outline-none"
            />
          </div>
          <div className="pt-20">
            <Button text="Sign up" type="pink" onClick={() => {}} />
          </div>
        </form>
        <p className="text-center mt-6 text-sm text-gray-500">
          Already have an account?{' '}
          <button
            onClick={() => router.push('/user/auth/signin')}
            className="text-gray-500 underline">
            Sign in!
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
