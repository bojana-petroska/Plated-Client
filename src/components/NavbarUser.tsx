'use client';
import React from 'react';
import Link from 'next/link';

const NavbarUser = () => {
  return (
    <header>
      <nav>
        <ul>
          <li><Link href="/user/home">Home</Link></li>
          <li><Link href="/user/orders">My Orders</Link></li>
          <li><Link href="/user/profile">Profile</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default NavbarUser;
