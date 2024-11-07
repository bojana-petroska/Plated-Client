'use client';
import React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import LandingScreen from '@/components/LandingScreen';

const LandingPage = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/auth/login'); 
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return <LandingScreen />;
};

export default LandingPage;
