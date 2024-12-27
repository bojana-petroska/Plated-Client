'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

const RestaurantContext = createContext<{
  restaurant_id: string | null;
  setRestaurantId: (id: string) => void;
}>({
  restaurant_id: null,
  setRestaurantId: () => {},
});

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [restaurant_id, setRestaurantId] = useState<string | null>(null);

  useEffect(() => {
    const storedRestaurantId = localStorage.getItem('restaurant_id');
    if (storedRestaurantId) {
      setRestaurantId(storedRestaurantId);
    }
    console.log(
      'Restaurant ID from localStorage on mount:',
      storedRestaurantId
    );
  }, []);

  useEffect(() => {
    console.log('Restaurant ID FROM CONTEXT:', restaurant_id);
  }, [restaurant_id]);

  return (
    <RestaurantContext.Provider value={{ restaurant_id, setRestaurantId }}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => useContext(RestaurantContext);
