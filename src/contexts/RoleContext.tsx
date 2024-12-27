'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface RoleContextType {
  userId: string | null;
  restaurantId: string | null;
  isRestaurant: boolean;
  setUserId: (id: string) => void;
  setRestaurantId: (id: string) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [isRestaurant, setIsRestaurant] = useState<boolean>(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedRestaurantId = localStorage.getItem('restaurantId');

    if (storedRestaurantId) {
      setRestaurantId(storedRestaurantId);
      setIsRestaurant(true);
    } else if (storedUserId) {
      setUserId(storedUserId);
      setIsRestaurant(false);
    }
  }, []);

  return (
    <RoleContext.Provider
      value={{
        userId,
        restaurantId,
        isRestaurant,
        setUserId,
        setRestaurantId,
      }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRoleContext = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRoleContext must be used within a RoleProvider');
  }
  return context;
};
