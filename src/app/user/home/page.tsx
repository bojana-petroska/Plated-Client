'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IRestaurant, IUser } from '@/types';
import axiosInstance from '@/services/api/axiosInstance';
import Header from '@/components/Header';
import GradientHeading from '@/components/GradientHeading';
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
  const [totalPages, setTotalPages] = useState(1);

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
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/restaurants?page=${page}&limit=10`
        );
        const fetchedRestaurants = Array.isArray(response?.data?.data)
          ? response.data.data
          : [];
        const totalRecords = response?.data.totalItems || 0;
        setRestaurants(fetchedRestaurants);

        const newFilteredRestaurants = [...filteredRestaurants, ...fetchedRestaurants]
        setFilteredRestaurants(newFilteredRestaurants);
        setTotalPages(Math.ceil(totalRecords / 10));
        console.log('Total Pages:', Math.ceil(totalRecords / 10));
      } catch (error) {
        console.error('Failed to fetch restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [page]);

  const handlePageClick = (pageNumber: number) => {
    setPage(pageNumber);
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

      <main className="flex-1 overflow-y-auto px-4 pb-[60px]">
        {' '}
        <h2 className="text-xl mb-4">Restaurants near you</h2>
        <RestaurantList
          filteredRestaurants={restaurants}
          handleRestaurantClick={handleRestaurantClick}
        />
        <div className="flex flex-wrap justify-center items-center mt-4 space-x-4 space-y-2 pb-[60px]">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={`px-4 py-2 rounded ${
                page === index + 1
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              } hover:bg-pink-400`}
              onClick={() => handlePageClick(index + 1)}>
              {index + 1}
            </button>
          ))}
        </div>
      </main>
      <NavbarUser />
    </div>
  );
};

export default HomePage;
