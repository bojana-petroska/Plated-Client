'use client';

import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
import axiosInstance from '../../../services/api/axiosInstance';
import { IMenuItem, IRestaurant } from '@/types';

const SingleRestaurantPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
  const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const restaurantResponse = await axiosInstance.get(
          `/restaurants/${id}`
        );
        console.log('Restaurant Response:', restaurantResponse.data);

        const menuResponse = await axiosInstance.get(`/restaurants/${id}/menu`);
        console.log('Menu Response:', menuResponse.data);

        setRestaurant(restaurantResponse.data);
        setMenuItems(menuResponse.data);
      } catch (err) {
        setError('Failed to load restaurant details.');
        console.error(err);
      }
    };

    fetchRestaurantDetails();
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!restaurant) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">{restaurant.name}</h1>
      <p>{restaurant.isOpen}</p>

      <h2 className="text-2xl font-semibold mt-6">Menu</h2>
      {menuItems.length === 0 ? (
        <p>No menu items available.</p>
      ) : (
        <ul className="list-disc ml-6">
          {menuItems.map((item) => (
            <li key={item.menuItem_id} className="mt-2">
              <span className="font-medium">{item.name}</span> - €
              {item.price.toFixed(2)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SingleRestaurantPage;
