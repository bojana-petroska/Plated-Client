'use client';
import React, { createContext, ReactNode, useContext, useEffect } from 'react';
import { IOrder } from '@/types';
import socketService from '@/services/socket';

interface NotificationContextType {
  registerRestaurant: (restaurantId: string) => void;
  registerUser: (userId: string) => void;
  registerCourier: (courierId: string) => void;
  listenForOrderCreation: (callback: (order: IOrder) => void) => void;
  listenForOrderStatusChange: (callback: (order: IOrder) => void) => void;
  listenForCourierPickUp: (callback: (order: IOrder) => void) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  useEffect(() => {
    socketService.connect();

    return () => {
      socketService.disconnect();
    };
  }, []);

  const contextValue: NotificationContextType = {
    registerRestaurant: (restaurantId: string) =>
      socketService.registerRestaurant(restaurantId),
    registerUser: (userId: string) => socketService.registerUser(userId),
    registerCourier: (courierId: string) =>
      socketService.registerCourier(courierId),
    listenForOrderCreation: (callback) =>
      socketService.listenForOrderCreation(callback),
    listenForOrderStatusChange: (callback) =>
      socketService.listenForOrderStatusChange(callback),
    listenForCourierPickUp: (callback) =>
      socketService.listenForCourierPickUp(callback),
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  }
  return context;
};