'use client';
import NavbarRestaurant from '@/components/NavbarRestaurant';
import { useRestaurant } from '@/contexts/RestaurantContext';
import React from 'react';

const RestaurantsHomePage = () => {
  const { restaurant_id } = useRestaurant();

  return (
    <div>
      <NavbarRestaurant />
      <div>Restaurant Home</div>
      <p>restaurant_id: {restaurant_id}</p>
    </div>
  );
};

export default RestaurantsHomePage;
