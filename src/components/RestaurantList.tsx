import React from 'react';
import { IRestaurant } from '@/types';

interface RestaurantListProps {
  filteredRestaurants: IRestaurant[];
  handleRestaurantClick: (restaurantId: number | undefined) => void;
}

const RestaurantList: React.FC<RestaurantListProps> = ({
  filteredRestaurants,
  handleRestaurantClick,
}) => {
  return (
    <ul className="space-y-6">
      {filteredRestaurants.map((restaurant, index) => (
        <li
          key={`${restaurant.restaurant_id}-${index}`}
          className="relative flex items-center bg-white rounded-lg shadow-xl cursor-pointer hover:shadow-xl transition-all overflow-hidden"
          onClick={() => handleRestaurantClick(restaurant.restaurant_id)}
        >
          <div className="flex-1 pl-5 pb-5 pt-5">
            <h3 className="text-lg font-semibold text-gray-900 relative z-10 pb-10">{restaurant.name}</h3>
           
            <div className="mt-1 flex items-center text-sm text-gray-600 space-x-4">
              <span>⏱ {restaurant.openingHours}</span>
            </div>
            <div className="mt-1 flex items-center text-sm text-gray-600 space-x-4">
              Address: {restaurant.address}
            </div>
            <p className="mt-1 flex items-center text-sm text-gray-600 space-x-4">Min Order: 10 €</p>
          </div>

          <div className="absolute right-[-40px] top-15 w-40 h-40 overflow-hidden rounded-full">
            <img
              src={restaurant.imageUrl || "/img/hero.jpg"}
              alt={restaurant.name}
              className="object-cover w-full h-full"
            />
          </div>
        </li>
      ))}
    </ul>
  );
};

export default RestaurantList;
