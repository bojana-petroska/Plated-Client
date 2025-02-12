import type { Metadata } from 'next';
import '../styles/globals.css';
import React from 'react';
import { CartProvider } from '@/contexts/CartContext';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import { RestaurantProvider } from '@/contexts/RestaurantContext';
import { RoleProvider } from '@/contexts/RoleContext';
import { UserProvider } from '@/contexts/UserContext';
import { NotificationProvider } from '@/contexts/NotificationContext';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log('Rendering RootLayout');
  return (
    <html lang="en">
      <head />
      <body>
        <RestaurantProvider>
          <UserProvider>
            <RoleProvider>
              <CartProvider>
              <NotificationProvider>
                {children}
                </NotificationProvider>
                <ConfirmDeleteModal />
              </CartProvider>
            </RoleProvider>
          </UserProvider>
        </RestaurantProvider>
      </body>
    </html>
  );
}
