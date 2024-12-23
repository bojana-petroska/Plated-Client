import React from 'react';

const FoodTypes: React.FC = () => {
  const images = [
    'pasta.png',
    'burger.png',
    'salad.png',
    'dessert.png',
    'pizza.png',
    'sushi.png',
    'poke_bowl.png',
    'mexican.png',
  ];

  return (
    <div className="relative w-full">
      <div className="flex overflow-x-auto space-x-4 py-4">
        {images.map((image, index) => (
          <div key={index} className="flex-shrink-0 w-32 h-24 rounded-lg overflow-hidden rounded-[20px]">
            <img
              src={`/img/${image}`}
              alt={image}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodTypes;
