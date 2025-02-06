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
          className="relative flex items-center bg-white rounded-lg shadow-[0px_4px_10px_rgba(0,0,0,0.2)] cursor-pointer hover:shadow-xl transition-all overflow-hidden"
          onClick={() => handleRestaurantClick(restaurant.restaurant_id)}>
          <div className="flex-1 pl-4 pb-5 pt-5">
            <h3 className="pl-2 text-lg font-semibold text-gray-900 relative z-10 pb-10">
              {restaurant.name}
            </h3>
            <div className="mt-1 flex items-center text-sm text-gray-600 space-x-4">
              <svg
                width="26"
                height="26"
                viewBox="0 0 18 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"
                  fill="#BFBFBF"
                />
                <path
                  d="M12 7V11.75C12 11.888 12.112 12 12.25 12H15"
                  stroke="black"
                  stroke-linecap="round"
                />
              </svg>
              <span>{restaurant.openingHours}</span>
            </div>
            <div className="mt-4 ml-1 flex items-center text-sm text-gray-600 space-x-2">
              <svg
                width="28"
                height="28"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9.99122 8.65844L6.57894 11.8976L3.16666 8.65844C2.49216 8.01736 2.03289 7.20069 1.84692 6.31167C1.66095 5.42265 1.75662 4.5012 2.12185 3.66383C2.48707 2.82646 3.10545 2.11077 3.8988 1.60724C4.69214 1.10371 5.62483 0.834961 6.57894 0.834961C7.53305 0.834961 8.46574 1.10371 9.25909 1.60724C10.0524 2.11077 10.6708 2.82646 11.036 3.66383C11.4013 4.5012 11.4969 5.42265 11.311 6.31167C11.125 7.20069 10.6657 8.01736 9.99122 8.65844ZM6.57894 7.08344C7.04424 7.08344 7.49047 6.90784 7.81948 6.59528C8.14849 6.28272 8.33333 5.8588 8.33333 5.41677C8.33333 4.97475 8.14849 4.55082 7.81948 4.23826C7.49047 3.9257 7.04424 3.75011 6.57894 3.75011C6.11365 3.75011 5.66742 3.9257 5.3384 4.23826C5.00939 4.55082 4.82456 4.97475 4.82456 5.41677C4.82456 5.8588 5.00939 6.28272 5.3384 6.59528C5.66742 6.90784 6.11365 7.08344 6.57894 7.08344ZM17.886 16.1584L14.4737 19.3984L11.0614 16.1576C10.3869 15.5165 9.92763 14.6999 9.74166 13.8108C9.55568 12.9218 9.65136 12.0004 10.0166 11.163C10.3818 10.3256 11.0002 9.60994 11.7935 9.10641C12.5869 8.60288 13.5196 8.33413 14.4737 8.33413C15.4278 8.33413 16.3605 8.60288 17.1538 9.10641C17.9472 9.60994 18.5656 10.3256 18.9308 11.163C19.296 12.0004 19.3917 12.9218 19.2057 13.8108C19.0197 14.6999 18.5605 15.5174 17.886 16.1584ZM14.4737 14.5834C14.939 14.5834 15.3852 14.4078 15.7142 14.0953C16.0432 13.7827 16.2281 13.3588 16.2281 12.9168C16.2281 12.4747 16.0432 12.0508 15.7142 11.7383C15.3852 11.4257 14.939 11.2501 14.4737 11.2501C14.0084 11.2501 13.5622 11.4257 13.2331 11.7383C12.9041 12.0508 12.7193 12.4747 12.7193 12.9168C12.7193 13.3588 12.9041 13.7827 13.2331 14.0953C13.5622 14.4078 14.0084 14.5834 14.4737 14.5834Z"
                  fill="#BFBFBF"
                />
              </svg>
              <span>{restaurant.address}</span>
            </div>
            <div className="flex items-center space-x-2 mt-3 ml-2">
              <svg
                width="28"
                height="28"
                viewBox="0 0 20 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M8.00006 12.3921L11.4584 14.4838C12.0917 14.8671 12.8667 14.3005 12.7001 13.5838L11.7834 9.65046L14.8417 7.00046C15.4001 6.51712 15.1001 5.60046 14.3667 5.54212L10.3417 5.20046L8.76673 1.48379C8.48339 0.808789 7.51673 0.808789 7.23339 1.48379L5.65839 5.19212L1.63339 5.53379C0.900061 5.59212 0.60006 6.50879 1.15839 6.99212L4.21673 9.64212L3.30006 13.5755C3.13339 14.2921 3.90839 14.8588 4.54173 14.4755L8.00006 12.3921Z"
                  fill="#BFBFBF"
                />
              </svg>
              <span className="mt-1 text-sm text-gray-600">
                {restaurant.rating}
              </span>
            </div>
            <p className="mt-6 ml-20 flex items-center text-sm text-gray-600 space-x-4">
              Min. Order 10 €
            </p>
          </div>

          <div className="absolute right-[-30px] top-15 w-36 h-36 overflow-hidden rounded-full">
            <img
              src={restaurant.imageUrl || '/img/hero.jpg'}
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
