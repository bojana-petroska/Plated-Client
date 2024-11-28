'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Buttons';

const LandingScreenUser = () => {
  const [showButtons, setShowButtons] = useState(false);
  const [moveLogo, setMoveLogo] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMoveLogo(true);
      setShowButtons(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-blue-500 transition-all duration-500 relative text-center">
      <img
        src="/img/hero.jpg"
        alt="Hero"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />

      <img
        src="/img/logo.jpg"
        alt="Logo"
        className={`transition-all duration-500 ${moveLogo ? 'mt-12' : 'mt-0'} w-32 h-32 z-10`}
      />

      <h1
        className={`text-4xl font-bold text-white ${showButtons ? 'mb-8 animate-slide-up' : 'animate-pulse'} z-10`}>
        Welcome to Plated
      </h1>

      {showButtons && (
        <div className="flex flex-col items-center space-y-4 z-10 justify-center text-center">
          <Button
            onClick={() => router.push('/user/auth/signin')}
            text="Sign in"
            type="white"
          />
          <p className="text-center text-white">or</p>
          <Button
            onClick={() => router.push('/user/auth/signup')}
            text="Sign up"
            type="pink"
          />
        </div>
      )}
    </div>
  );
};

export default LandingScreenUser;
