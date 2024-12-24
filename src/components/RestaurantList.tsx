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
    <ul className="space-y-4">
      {filteredRestaurants.map((restaurant, index) => (
        <li
          key={`${restaurant.restaurant_id}-${index}`}
          className="relative flex items-center gap-4 p-6 bg-white rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-all"
          onClick={() => handleRestaurantClick(restaurant.restaurant_id)}
        >
          {/* Restaurant Image (cut-out circle extending beyond card) */}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-24 h-24 overflow-hidden rounded-full border-4 border-white shadow-lg">
            <img
              src="/img/hero.jpg"
              alt="Restaurant placeholder"
              className="object-cover w-full h-full"
            />
          </div>

          {/* Restaurant Info Section */}
          <div className="flex-1 pr-28">
            <h3 className="text-xl font-bold">{restaurant.name}</h3>
            <p className="text-sm text-gray-600">{restaurant.openingHours}</p>
            <div className="mt-2 text-sm text-yellow-600 font-bold">
              ★ {restaurant.rating || 'N/A'}
            </div>
            <p className="mt-2 text-sm text-gray-600">Min Order: €10</p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default RestaurantList;
