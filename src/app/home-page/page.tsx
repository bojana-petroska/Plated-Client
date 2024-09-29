'use client';
import React from 'react';
import restaurantApi from '@/services/api/restaurantApi';
import { useEffect, useState } from 'react';

interface IRestaurant {
    id: number;
    name: string;
    password: string;
    address: string;
    phoneNumber: string;
    email: string;
    openingHours: string;
    deliveryRadius: number;
    role: string;
    menu: Array<number>;
    isOpen: boolean;
  }

const HomePage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const data = await restaurantApi.getAllRestaurants();
      setRestaurants(data);
    };
    fetchRestaurants();
  }, []);

  return (
    <div>
      <h2>all restaurants</h2>
      <ul>
        {restaurants.map((r) => (
            <li key={r.id}>{r.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
