import React from 'react';

interface ButtonProps {
  onClick: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  text?: string;
  type: 'white' | 'pink' | 'grey' | 'blue' | 'green';
  size?: 'default' | 'small';
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  text,
  type,
  size = 'default',
  children,
}) => {
  const baseStyles = 'px-24 py-3 rounded-[15px] transition duration-300';
  const sizeStyles =
    size === 'small' ? 'px-4 py-1' : 'w-full px-4 py-3 border rounded-[15px]';

  const colorStyles = {
    white: 'bg-white text-black hover:bg-gray-100 border-none',
    pink: 'bg-[#FF7F7F] text-white hover:bg-[#FF6B6B] border-none',
    grey: 'bg-[#F0F0F0] text-black hover:bg-white border-none',
    blue: 'bg-[#6B9FDC] text-white border-none',
    green: 'bg-green-500 text-white hover:bg-green-600 border-none',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles} ${colorStyles[type]}`}>
      {children || text}
    </button>
  );
};

export default Button;
