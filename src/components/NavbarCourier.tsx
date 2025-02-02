'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavbarCourier = () => {
  const pathName = usePathname();

  return (
    <footer className="fixed bottom-3 left-3 right-3 bg-gray-100 py-4 flex justify-around items-center rounded-[50px] shadow-md z-50">
      <NavButton
        href="/courier/profile"
        svg={profileIcon}
        isActive={pathName === '/courier/profile'}
      />
      <NavButton
        href="/courier/orders"
        svg={ordersIcon}
        isActive={pathName === '/courier/orders'}
      />
      <NavButton
        href="/courier/messages"
        svg={messagesIcon}
        isActive={pathName === '/courier/messages'}
      />
    </footer>
  );
};

const NavButton: React.FC<{
  href: string;
  svg: string;
  isActive: boolean;
  children?: React.ReactNode;
}> = ({ href, svg, isActive, children }) => {
  return (
    <Link
      href={href}
      className={`relative flex items-center justify-center w-12 h-12 ${isActive ? 'bg-black text-white' : 'bg-gray-100 text-black'} rounded-full hover:bg-black hover:text-white transition-all duration-300`}
      aria-label="Navigation Button">
      <span
        className="absolute inset-0 flex items-center justify-center"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {children}
    </Link>
  );
};

const profileIcon = `
<svg width="24" height="26" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.45455 20.2328V18.8894C3.45455 15.9204 5.85929 13.5156 8.82828 13.5156H14.202C17.171 13.5156 19.5758 15.9204 19.5758 18.8894V20.2328" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.5152 9.48541C9.28505 9.48541 7.48485 7.68521 7.48485 5.45511C7.48485 3.22501 9.28505 1.4248 11.5152 1.4248C13.7453 1.4248 15.5455 3.22501 15.5455 5.45511C15.5455 7.68521 13.7453 9.48541 11.5152 9.48541Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const ordersIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17 4H7C5.89543 4 5 4.89543 5 6V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V6C19 4.89543 18.1046 4 17 4Z" stroke="#323232" stroke-width="2"/>
<path d="M9 9H15M9 13H15M9 17H13" stroke="#323232" stroke-width="2" stroke-linecap="round"/>
</svg>
`;

const messagesIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="#323232" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

export default NavbarCourier;
