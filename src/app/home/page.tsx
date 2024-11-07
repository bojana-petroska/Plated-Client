'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import restaurantApi from '@/services/api/restaurantApi';
import authService from '@/services/authService';
import { IRestaurant, IUser } from '@/types';

const HomePage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<IUser>();
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await authService.verify();
        setUser(response.data.user);
      } catch (err) {
        router.push('/auth/login');
        console.log(err)
      }
    };
    verifyToken();
  }, [router]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const response = await restaurantApi.getAllRestaurants();
      if (response && Array.isArray(response.data)) {
        setRestaurants(response.data);
      }
    };
    fetchRestaurants();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="p-8">
        <h1 className="text-3xl">Welcome, {user.userName}!</h1>
        <h2 className="mt-6 text-2xl">All Restaurants</h2>
        <ul>
          {restaurants.map((restaurant) => (
            <li key={restaurant.id}>{restaurant.name}</li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default HomePage;
