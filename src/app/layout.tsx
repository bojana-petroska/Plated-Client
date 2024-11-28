import type { Metadata } from 'next';
import '../styles/globals.css';
import React from 'react';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

// 'use client';
// import React from 'react';
// import { usePathname } from 'next/navigation';
// import NavbarRestaurant from '../components/NavbarRestaurant';
// import NavbarUser from '../components/NavbarUser';
// import Footer from '../components/Footer';
// import '../styles/globals.css';

// export default function GeneralLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const pathname = usePathname();

//   const isRestaurantLanding = pathname === '/restaurant/landing' || '/restaurant/signin';
//   const isRestaurantRoute = pathname.startsWith('/restaurant');
//   const isUserLanding = pathname === '/user/landing' || 'user/signin';
//   const isUserRoute = pathname.startsWith('/user');

//   return (
//     <html lang="en">
//       <body>
//         {!isRestaurantLanding && isRestaurantRoute && <NavbarRestaurant />}

//         {!isUserLanding && isUserRoute && <NavbarUser />}

//         <main>{children}</main>

//         {!isRestaurantLanding && !isUserLanding && <Footer />}
//       </body>
//     </html>
//   );
// }
