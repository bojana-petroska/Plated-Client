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
  const [paginatedRestaurants, setPaginatedRestaurants] = useState<
    IRestaurant[]
  >([]);
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
        localStorage.removeItem('userAuthToken');
        setError('Session expired or token invalid');
        router.push('/user/auth/signin');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  useEffect(() => {
    const fetchAllRestaurants = async () => {
      try {
        setLoading(true);
        let allRestaurantsList: IRestaurant[] = [];
        let currentPage = 1;
        let totalFetched = 0;
        let totalRecords = 1;

        while (totalFetched < totalRecords) {
          const response = await axiosInstance.get(
            `/restaurants?page=${currentPage}&limit=10`
          );

          const fetchedRestaurants = response?.data?.data || [];
          totalRecords = response?.data?.totalItems || 0;

          allRestaurantsList = [...allRestaurantsList, ...fetchedRestaurants];
          totalFetched += fetchedRestaurants.length;
          currentPage++;
        }

        setRestaurants(allRestaurantsList);
        setFilteredRestaurants(allRestaurantsList);
        setTotalPages(Math.ceil(totalRecords / 10));
      } catch (error) {
        console.error('Failed to fetch restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllRestaurants();
  }, []);

  useEffect(() => {
    const startIndex = (page - 1) * 10;
    const endIndex = startIndex + 10;
    setPaginatedRestaurants(filteredRestaurants.slice(startIndex, endIndex));
  }, [filteredRestaurants, page]);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredRestaurants(restaurants);
      setTotalPages(Math.ceil(restaurants.length / 10));
    } else {
      const filtered = restaurants.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRestaurants(filtered);
      setTotalPages(Math.ceil(filtered.length / 10));
      setPage(1);
    }
  }, [searchQuery, restaurants]);

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
        <RestaurantList
          filteredRestaurants={paginatedRestaurants}
          handleRestaurantClick={handleRestaurantClick}
        />
        <div className="flex flex-wrap justify-center items-center mt-4 space-x-4 pb-[60px]">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={`px-2 py-1 rounded ${
                page === index + 1
                  ? 'bg-[#FF7F7F]/15 text-[#FF7F7F]'
                  : 'text-gray-800'
              } hover:bg-[#FF7F7F]/15 hover:text-[#FF7F7F]`}
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
