'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext<{
  user_id: string | null;
  setUserId: (id: string) => void;
}>({
  user_id: null,
  setUserId: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user_id, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
    setLoading(false);
    console.log('User ID from localStorage on mount:', storedUserId);
  }, []);

  useEffect(() => {
    console.log('User ID FROM CONTEXT:', user_id);
  }, [user_id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <UserContext.Provider value={{ user_id, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
