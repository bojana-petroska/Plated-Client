'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IRestaurant, IUser } from '@/types';
import axiosInstance from '@/services/api/axiosInstance';
import Header from '@/components/Header';
import GradientHeading from '@/components/GradientHeading';
import Button from '@/components/Buttons';
import FoodTypes from '@/components/FoodType';
import NavbarUser from '@/components/NavbarUser';

const HomePage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get('/users/profile');
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
    };

    fetchUserData();
  }, [router]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axiosInstance.get(`/restaurants?page=${page}`);
        console.log(response.data.data);
        if (response?.data.data && Array.isArray(response.data.data)) {
          setRestaurants((prev) => [...prev, ...response.data.data]);
        }
      } catch (error) {
        console.error('Failed to fetch restaurants:', error);
      }
    };

    fetchRestaurants();
  }, [page]);

  const loadMoreRestaurants = () => {
    setPage((prev) => prev + 1);
  };

  const handleRestaurantClick = async (restaurantId: number | undefined) => {
    try {
      const restaurant = await axiosInstance.get(
        `/restaurants/${restaurantId}`
      );
      const menuItems = await axiosInstance.get(
        `/restaurants/${restaurantId}/menu`
      );
      console.log('Restaurant:', restaurant.data);
      console.log('Menu Items:', menuItems.data);
      router.push(`/restaurant/${restaurantId}`);
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
    }
  };

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
    <div className="flex flex-col min-h-screen bg-white">
      <Header logoSrc="/img/logo.jpg" userName={user.userName} />
      <section className="p-4">
        <GradientHeading />
        <div className="relative w-full max-w-md">
          <p className="mb-2 text-[16px] font-[MontserratAlternates] text-[#323232]">
            What do you feel like eating today?
          </p>
          <div className="relative">
            <input
              type="text"
              placeholder="Find a restaurant..."
              className="w-full px-4 py-2 pr-20 border border-gray-300 rounded-[15px] focus:outline-none"
            />
            <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
              <Button
                // onClick={handleSearch}
                text="Search"
                type="pink"
                size="small"
              />
            </div>
          </div>
        </div>
        <div className="p-4">
          <FoodTypes />
        </div>
      </section>

      <main className="flex-1 overflow-y-auto px-4">
        <h2 className="text-xl font-bold mb-4">Restaurants near you</h2>
        <ul className="space-y-4">
          {restaurants.map((restaurant) => (
            <li
              key={restaurant.restaurant_id}
              className="flex items-center gap-4 p-4 border border-gray-200 rounded shadow-sm cursor-pointer"
              onClick={() => handleRestaurantClick(restaurant.restaurant_id)}>
              <img
                src="/img/hero.jpg"
                alt="Restaurant placeholder"
                width={80}
                height={80}
                className="rounded object-cover"
              />
              <div className="flex-1">
                <h3 className="text-lg font-bold">{restaurant.name}</h3>
              </div>
              <div className="text-right">
                <p className="text-sm text-yellow-600 font-bold">
                  ★ {restaurant.rating || 'N/A'}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {loading && <p>Loading more restaurants...</p>}
        <button
          className="w-full p-2 mt-4 bg-red-500 text-white rounded"
          onClick={loadMoreRestaurants}>
          Load More
        </button>
      </main>
      <NavbarUser />
    </div>
  );
};

export default HomePage;
