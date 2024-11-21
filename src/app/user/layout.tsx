import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'User Dashboard',
  description: 'User-specific pages',
};

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <header>
          <nav>
            <ul>
              <li><Link href="/user/home">Home</Link></li>
              <li><Link href="/user/orders">My Orders</Link></li>
              <li><Link href="/user/profile">Profile</Link></li>
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

export default UserLayout;
