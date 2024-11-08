import authService from '@/services/authService';
import React, { useState } from 'react';

type SignupData = { userName: string; email: string; password: string };
type LoginData = { userName: string; password: string };

interface AuthFormProps {
  isSignup?: boolean;
  onSubmit: (data: SignupData | LoginData) => void;
}

const AuthForm = ({ isSignup = false, onSubmit }: AuthFormProps) => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState(''); // Only used for signup
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState(''); // Only for signup

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignup && password !== repeatPassword) {
      alert('Passwords do not match!');
      return;
    }

    const data = isSignup
      ? { userName, email, password }
      : { userName, password };

    try {
      if (isSignup) {
        const response = await authService.signup(data as SignupData);
        localStorage.setItem('authToken', response.data.token);
        onSubmit(data as SignupData);
      } else {
        const response = await authService.login(data as LoginData);
        localStorage.setItem('authToken', response.data.token);
        onSubmit(data as LoginData);
      }
    } catch (error) {
      console.error('Authentication error', error);
      alert('Authentication failed!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      {isSignup && (
        <>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required={isSignup}
            className="input-class"
          />
        </>
      )}
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
      {isSignup && (
        <input
          type="password"
          placeholder="Repeat Password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          required
          className="input-class"
        />
      )}
      <button type="submit" className="btn-class">
        {isSignup ? 'Sign Up' : 'Log In'}
      </button>
    </form>
  );
};

export default AuthForm;
