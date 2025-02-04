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
        {items.slice(2, 5).map((item) => (
          <div
            key={item.menuItem_id}
            className="w-40 h-40 bg-[#FFECEC] rounded-2xl flex flex-col items-center justify-center py-4">
            <img
              src={item.imageUrl || '/img/sushi.png'}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-full"
            />
            <div className="h-10 flex items-center justify-center">
              <p className="text-sm text-center px-2 pt-2">{item.name}</p>
            </div>
            <p className="text-xs text-gray-600 pt-1">{item.price} €</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bestsellers;
