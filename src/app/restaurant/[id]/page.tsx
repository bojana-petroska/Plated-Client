'use client';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../services/api/axiosInstance';
import { IMenuItem, IRestaurant } from '@/types';
import NavbarUser from '@/components/NavbarUser';
import RestaurantList from '@/components/RestaurantList';
import Bestsellers from '@/components/Bestsellers';

const SingleRestaurantPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
  const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
  const [cart, setCart] = useState<IMenuItem[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const restaurantResponse = await axiosInstance.get(
          `/restaurants/${id}`
        );
        const menuResponse = await axiosInstance.get(`/restaurants/${id}/menu`);

        setRestaurant(restaurantResponse.data);
        setMenuItems(menuResponse.data);
      } catch (err) {
        setError('Failed to load restaurant details.');
        console.error(err);
      }
    };

    fetchRestaurantDetails();
  }, [id]);

  const handleRestaurantClick = (restaurantId: number | undefined) => {
    console.log('Clicked restaurant:', restaurantId);
  };

  const addToCart = (menuItem: IMenuItem) => {
    setCart((prevCart) => [...prevCart, menuItem]);
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!restaurant) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <RestaurantList
        filteredRestaurants={[restaurant]}
        handleRestaurantClick={handleRestaurantClick}
      />
      <Bestsellers items={menuItems} />
      <h2 className="text-l font-bold mb-4">Menu</h2>
      <ul className="space-y-4">
  {menuItems.map((item) => (
    <React.Fragment key={item.menuItem_id}>
      <div className="h-[0.5px] bg-black w-screen relative left-[-2rem]"></div>
      <li className="flex items-center justify-between bg-white rounded-lg">
        <div className="flex-1 pr-2">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-gray-500 text-sm">{item.description}</p>
          <p className="text-gray-700 mt-1">{item.price} €</p>
        </div>
        <button
          onClick={() => addToCart(item)}
          className="border-2 border-[#FF7F7F] text-[#FF7F7F] rounded-full w-5 h-5 flex items-center justify-center transition-all duration-200 hover:bg-[#FF7F7F] hover:text-white"
        >
          +
        </button>
      </li>
    </React.Fragment>
  ))}
</ul>

      <NavbarUser />
    </div>
  );
};

export default SingleRestaurantPage;
