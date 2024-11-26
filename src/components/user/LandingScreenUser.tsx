'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const LandingScreen = () => {
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
    <div className="flex flex-col justify-center items-center h-screen bg-blue-500 transition-all duration-500 relative">
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

      <h1 className={`text-4xl font-bold text-white ${showButtons ? 'mb-8 animate-slide-up' : 'animate-pulse'} z-10`}>
        Welcome to Plated
      </h1>

      {showButtons && (
        <div className="space-x-4 z-10">
          <button
            onClick={() => router.push('/user/auth/signin')}
            className="px-4 py-2 bg-white text-white-300 rounded"
          >
            Sign In
          </button>
          <button
            onClick={() => router.push('/user/auth/signup')}
            className="px-4 py-2 bg-white text-white-300 rounded"
          >
            Sign Up
          </button>
        </div>
      )}
    </div>
  );
};

export default LandingScreen;
