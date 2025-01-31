'use client';
import NavbarRestaurant from '@/components/NavbarRestaurant';
import { useRestaurant } from '@/contexts/RestaurantContext';
import React from 'react';

const RestaurantsProfilePage = () => {
  const { restaurant_id } = useRestaurant();

  return (
    <div>
      <div>Restaurant Home</div>
      <p>restaurant_id: {restaurant_id}</p>
      <NavbarRestaurant />
    </div>
  );
};

export default RestaurantsProfilePage;
