'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavbarRestaurant = () => {
  const pathName = usePathname();

  return (
    <footer className="fixed bottom-3 left-3 right-3 bg-gray-100 py-4 flex justify-around items-center rounded-[50px] shadow-md z-50">
      <NavButton
        href="/restaurant/profile"
        isActive={pathName === '/restaurant/profile'}
        text="Profile"
      />
      <NavButton
        href="/restaurant/orders"
        isActive={pathName === '/restaurant/orders'}
        text="Orders"
      />
    </footer>
  );
};

const NavButton: React.FC<{
  href: string;
  text: string;
  isActive: boolean;
  children?: React.ReactNode;
}> = ({ href, text, isActive }) => {
  return (
    <Link
      href={href}
      className={`relative flex items-center justify-center w-12 h-12  pr-20 pl-20 ${isActive ? 'bg-black text-white' : 'bg-gray-100 text-black'} rounded-full hover:bg-black hover:text-white transition-all duration-300`}
      aria-label="Navigation Button">
      <span className="absolute inset-0 flex items-center justify-center" />
      {text}
    </Link>
  );
};

export default NavbarRestaurant;
