'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IRestaurant, IUser } from '@/types';
import axiosInstance from '@/services/api/axiosInstance';

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
      {/* Header */}
      <header className="p-4 bg-red-500 text-white flex justify-between items-center">
        <h1 className="text-lg font-bold">PLATED</h1>
        {user && <p className="text-sm">Welcome, {user.userName}!</p>}
      </header>

      {/* Search and Categories */}
      <section className="p-4">
        <h2 className="text-2xl font-bold mb-4">
          YOUR MEAL YOUR WAY RIGHT AWAY
        </h2>
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Find a restaurant..."
            className="flex-1 p-2 border border-gray-300 rounded"
          />
          <button className="px-4 py-2 bg-red-500 text-white rounded">
            Search
          </button>
        </div>

        <div className="flex justify-between mb-6">
          <button className="bg-orange-100 text-orange-700 px-4 py-2 rounded">
            Pasta (16)
          </button>
          <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded">
            Burger (9)
          </button>
          <button className="bg-green-100 text-green-700 px-4 py-2 rounded">
            Salad (6)
          </button>
        </div>
      </section>

      {/* Restaurant List */}
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
                <p className="text-sm text-gray-500">
                  {restaurant.address}
                </p>{' '}
                {/* Display address instead of cuisine */}
                <p className="text-sm text-gray-500">
                  Phone: {restaurant.phoneNumber}
                </p>
                <p className="text-sm text-gray-500">
                  Email: {restaurant.email}
                </p>
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

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-100 p-4 flex justify-around">
        <button className="text-gray-700">Home</button>
        <button className="text-gray-700">Orders</button>
        <button className="text-gray-700">Profile</button>
      </footer>
    </div>
  );
};

export default HomePage;
