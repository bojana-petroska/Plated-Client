'use strict'
import React from 'react';
import Link from 'next/link';

const NavbarRestaurant = () => {
  return (
    <header>
      <nav>
        <ul>
          <li><Link href="/restaurant/home">Dashboard</Link></li>
          <li><Link href="/restaurant/orders">Orders</Link></li>
          <li><Link href="/restaurant/menu">Manage Menu</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default NavbarRestaurant;
