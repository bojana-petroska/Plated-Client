'use client';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../services/api/axiosInstance';
import { IMenuItem, IOrderItem, IRestaurant } from '@/types';
import NavbarUser from '@/components/NavbarUser';
import RestaurantList from '@/components/RestaurantList';
import Bestsellers from '@/components/Bestsellers';
import { useCart } from '@/contexts/CartContext';
import { useRestaurant } from '@/contexts/RestaurantContext';

const SingleRestaurantPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const { setRestaurantId } = useRestaurant();
  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
  const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
  const [error, setError] = useState('');
  const [alert, setAlert] = useState(false);

  const { addToCart, cart } = useCart();

  const handleAddToCart = (item: IMenuItem) => {
    const orderItem: IOrderItem = {
      menuItem: item,
      quantity: 1,
    };
    addToCart(orderItem);
    setAlert(true);
    setTimeout(() => setAlert(false), 2000);
    console.log('CART:', cart);
  };

  useEffect(() => {
    if (setRestaurantId) {
      setRestaurantId(id);
    }
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
  }, [id, setRestaurantId]);

  const handleRestaurantClick = (restaurantId: number | undefined) => {
    console.log('Clicked restaurant:', restaurantId);
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!restaurant) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <RestaurantList
        filteredRestaurants={[restaurant]}
        handleRestaurantClick={handleRestaurantClick}
      />
      <Bestsellers items={menuItems} />
      <div className="p-4">
        <h2 className="text-l font-bold mb-4">Menu</h2>
        <ul className="space-y-4 pb-[100px]">
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
                  onClick={() => handleAddToCart(item)}
                  className="border-2 border-[#FF7F7F] text-[#FF7F7F] rounded-full w-5 h-5 flex items-center justify-center transition-all duration-200 hover:bg-[#FF7F7F] hover:text-white">
                  +
                </button>
              </li>
            </React.Fragment>
          ))}
        </ul>
      </div>

      {alert && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white text-center p-5 rounded z-50">
          Item added to cart!
        </div>
      )}

      <NavbarUser />
    </div>
  );
};

export default SingleRestaurantPage;
