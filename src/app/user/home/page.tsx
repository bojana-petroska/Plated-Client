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
import RestaurantList from '@/components/RestaurantList';

const HomePage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<IRestaurant[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get('/users/profile');
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        localStorage.removeItem('authToken');
        setError('Session expired or token invalid');
        router.push('/user/auth/signin');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      if (!hasMore || loading) return;

      try {
        setLoading(true);
        const response = await axiosInstance.get(`/restaurants?page=${page}`);
        const fetchedRestaurants = Array.isArray(response?.data?.data)
          ? response.data.data
          : [];
        setRestaurants((prev) => [...prev, ...fetchedRestaurants]);
        setFilteredRestaurants((prev) => [...prev, ...fetchedRestaurants]);

        if (fetchedRestaurants.length < 20) {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Failed to fetch restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [page, hasMore, loading]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredRestaurants(restaurants);
    } else {
      const keywords = searchQuery.toLowerCase().split(/\s+/);

      const filtered = restaurants.filter((restaurant) => {
        const nameMatch = keywords.some((keyword) =>
          restaurant.name.toLowerCase().includes(keyword)
        );

        const menuItemsMatch = restaurant.menu?.some(
          (menuItem: { name: string }) =>
            keywords.some((keyword) =>
              menuItem.name.toLowerCase().includes(keyword)
            )
        );

        return nameMatch || menuItemsMatch;
      });

      setFilteredRestaurants(filtered);
    }
  }, [searchQuery, restaurants]);

  const loadMoreRestaurants = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const handleRestaurantClick = async (restaurantId: number | undefined) => {
    try {
      router.push(`/restaurant/${restaurantId}`);
    } catch (error) {
      console.error('Error navigating to restaurant:', error);
    }
  };

  if (loading && page === 1) {
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-4 pr-20 border border-gray-300 rounded-[15px] focus:outline-none"
            />
          </div>
        </div>
        <div className="p-4">
          <FoodTypes />
        </div>
      </section>

      <main className="flex-1 overflow-y-auto px-4">
        <h2 className="text-xl mb-4">Restaurants near you</h2>
        <RestaurantList
          filteredRestaurants={filteredRestaurants}
          handleRestaurantClick={handleRestaurantClick}
        />
        {loading && <p>Loading more restaurants...</p>}
        {!loading && hasMore && (
          <div className="flex justify-center mt-4">
            <Button
              text="Load More Restaurants"
              type="pink"
              size="small"
              onClick={loadMoreRestaurants}
            />
          </div>
        )}
        {!hasMore && <p>No more restaurants available.</p>}
      </main>
      <NavbarUser />
    </div>
  );
};

export default HomePage;
