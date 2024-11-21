import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Restaurant Dashboard',
  description: 'Restaurant-specific pages',
};

const RestaurantLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <header>
          <nav>
            <ul>
              <li><Link href="/restaurant/home">Dashboard</Link></li>
              <li><Link href="/restaurant/orders">Orders</Link></li>
              <li><Link href="/restaurant/menu">Manage Menu</Link></li>
            </ul>
          </nav>
        </header>
        <main>{children}</main>
        <footer>
          <p>© 2024 Plated</p>
        </footer>
      </body>
    </html>
  );
};

export default RestaurantLayout;
