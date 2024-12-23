'use client';
import React from 'react';
import Link from 'next/link';

const NavbarUser = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-100 py-4 flex justify-around items-center rounded-t-xl shadow-md">
      <NavButton href="/user/home" svg={homeIcon} />
      <NavButton href="/user/orders" svg={ordersIcon} />
      <NavButton href="/user/cart" svg={cartIcon} />
      <NavButton href="/user/profile" svg={profileIcon} />
    </footer>
  );
};

const NavButton: React.FC<{ href: string; svg: string }> = ({ href, svg }) => {
  return (
    <Link href={href} className="relative flex items-center justify-center w-12 h-12 bg-gray-100 text-black rounded-full hover:bg-black hover:text-white transition-all duration-300"
    aria-label="Navigation Button">
        <span
          className="absolute inset-0 flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
    </Link>
  );
};

// SVG Icons
const homeIcon = `
<svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20.125 18.2079V11.7554C20.125 11.2355 20.0192 10.721 19.8141 10.2432C19.609 9.76541 19.3088 9.33435 18.9319 8.97624L12.8206 3.17162C12.4644 2.83321 11.9918 2.64453 11.5005 2.64453C11.0092 2.64453 10.5366 2.83321 10.1804 3.17162L4.06812 8.97624C3.69117 9.33435 3.391 9.76541 3.18589 10.2432C2.98077 10.721 2.875 11.2355 2.875 11.7554V18.2079C2.875 18.7162 3.07693 19.2037 3.43638 19.5632C3.79582 19.9226 4.28334 20.1245 4.79167 20.1245H18.2083C18.7167 20.1245 19.2042 19.9226 19.5636 19.5632C19.9231 19.2037 20.125 18.7162 20.125 18.2079Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const ordersIcon = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17 4H7C5.89543 4 5 4.89543 5 6V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V6C19 4.89543 18.1046 4 17 4Z" stroke="currentColor" stroke-width="2"/>
<path d="M9 9H15M9 13H15M9 17H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>
`;

const cartIcon = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5 7H18.79C19.0694 7.00001 19.3457 7.05857 19.6011 7.17191C19.8565 7.28524 20.0854 7.45083 20.2729 7.65801C20.4603 7.86519 20.6023 8.10936 20.6897 8.37478C20.777 8.64019 20.8078 8.92097 20.78 9.199L20.18 15.199C20.1307 15.6925 19.8997 16.1501 19.532 16.4829C19.1642 16.8157 18.686 17 18.19 17H8.64C8.17747 17.0002 7.72918 16.84 7.37144 16.5469C7.01371 16.2537 6.76866 15.8456 6.678 15.392L5 7Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
<path d="M5 7L4.19 3.757C4.13583 3.54075 4.01095 3.34881 3.83521 3.21166C3.65946 3.0745 3.44293 3.00001 3.22 3H2M8 21H10M16 21H18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const profileIcon = `
<svg width="24" height="26" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.45455 20.2328V18.8894C3.45455 15.9204 5.85929 13.5156 8.82828 13.5156H14.202C17.171 13.5156 19.5758 15.9204 19.5758 18.8894V20.2328" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.5152 9.48541C9.28505 9.48541 7.48485 7.68521 7.48485 5.45511C7.48485 3.22501 9.28505 1.4248 11.5152 1.4248C13.7453 1.4248 15.5455 3.22501 15.5455 5.45511C15.5455 7.68521 13.7453 9.48541 11.5152 9.48541Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

export default NavbarUser;
