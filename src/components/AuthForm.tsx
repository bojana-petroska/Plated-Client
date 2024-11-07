import authService from '@/services/authService';
import React, { useState } from 'react';

type SignupData = { username: string; email: string; password: string };
type LoginData = { username: string; password: string };

interface AuthFormProps {
  isSignup?: boolean;
  onSubmit: (data: SignupData | LoginData) => void;
}

const AuthForm = ({ isSignup = false, onSubmit }: AuthFormProps) => {
  const [username, setUsername] = useState('');
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
      ? { username, email, password }
      : { username, password };

    try {
      if (isSignup) {
        await authService.signup(data as SignupData);
        onSubmit(data as SignupData);
      } else {
        await authService.login(data as LoginData);
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
        value={username}
        onChange={(e) => setUsername(e.target.value)}
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
