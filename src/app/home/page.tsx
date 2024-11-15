'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import restaurantApi from '@/services/api/restaurantApi';
// import authService from '@/services/authService';
import { IRestaurant, IUser } from '@/types';
import axios from 'axios';

const HomePage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   const verifyToken = async () => {
  //     try {
  //       const response = await authService.verify();
  //       console.log(response);
  //       setUser(response?.data?.user);
  //     } catch (err) {
  //       console.log(err);
  //       setError('Session expired or token invalid');
  //       router.push('/auth/signin');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   verifyToken();
  // }, [router]);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');
      console.log('TOKEN USED FOR USER FETCHING:', token);
      if (token) {
        try {
          const response = await axios.get(
            `http://localhost:5001/users/profile`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(response);
          console.log(response.data);
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          localStorage.removeItem('authToken');
          setError('Session expired or token invalid');
          router.push('/auth/signin');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await restaurantApi.getAllRestaurants();
        if (response && Array.isArray(response.data)) {
          setRestaurants(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch restaurants:', error);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>You must be logged in to view this page.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl">Welcome, {user.userName}!</h1>
      <h2 className="mt-6 text-2xl">All Restaurants</h2>
      <ul>
        {restaurants.map((restaurant) => (
          <li key={restaurant.id}>{restaurant.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
