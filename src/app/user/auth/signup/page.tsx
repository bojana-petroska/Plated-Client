'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import authService from '../../../../services/authService';

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
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-class"
          />
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
          <input
            type="password"
            placeholder="Repeat Password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
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

export default SignUp;
