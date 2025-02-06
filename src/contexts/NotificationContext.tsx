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
  sendMessageToUser: (orderId: string, userId: string, message: string) => void;
  listenForCourierMessages: (
    callback: (data: { orderId: string; message: string }) => void
  ) => void;
  // notifications: NotificationOrder;
}

// interface NotificationOrder extends IOrder {
//   courierMessage?: string;
// }

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // const [notifications, setNotifications] = useState<NotificationOrder[]>([]);

  useEffect(() => {
    socketService.connect();

    // socketService.listenForCourierMessages((data: { orderId: string; message: string }) => {
    //   console.log('Courier messages received:', data);

    //   setNotifications((prevNotifications) => {
    //     const updatedNotifications = [...prevNotifications];
    //     const orderIndex = updatedNotifications.findIndex(
    //       (order) => order.order_id?.toString() === data.orderId
    //     );
    //     if (orderIndex >= 0) {
    //       updatedNotifications[orderIndex] = {
    //         ...updatedNotifications[orderIndex],
    //         courierMessage: data.message,
    //       };
    //     }

    //     return updatedNotifications;
    //   });
    // });

    return () => {
      // socketService.disconnect();
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
    sendMessageToUser: (orderId, userId, message) =>
      socketService.sendMessageToUser(orderId, userId, message),
    listenForCourierMessages: (callback) =>
      socketService.listenForCourierMessages(callback),
    // notifications2: notifications
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
