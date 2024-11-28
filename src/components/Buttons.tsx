import React from 'react';

interface ButtonProps {
  onClick: () => void;
  text: string;
  type: 'white' | 'pink';
}

const Button: React.FC<ButtonProps> = ({ onClick, text, type }) => {
  const baseStyles = 'px-24 py-3 rounded-lg transition duration-300';
  const whiteButtonStyles = 'bg-white text-black hover:bg-gray-100';
  const pinkButtonStyles = 'bg-[#FF7F7F] text-white hover:bg-[#FF6B6B]';

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${type === 'white' ? whiteButtonStyles : pinkButtonStyles}`}>
      {text}
    </button>
  );
};

export default Button;
