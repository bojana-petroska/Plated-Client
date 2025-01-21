import React from 'react';
import { IMenuItem } from '@/types';

interface BestsellersProps {
  items: IMenuItem[];
}

const Bestsellers: React.FC<BestsellersProps> = ({ items }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 pt-10">Bestsellers</h2>
      <div className="flex space-x-4 overflow-x-scroll">
        {items.slice(0, 3).map((item) => (
          <div
            key={item.menuItem_id}
            className="w-40 h-40 bg-pink-100 rounded-lg flex flex-col items-center justify-center"
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-full"
            />
            <h3 className="text-sm mt-2">{item.name}</h3>
            <p className="text-xs text-gray-600">{item.price} €</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bestsellers;
