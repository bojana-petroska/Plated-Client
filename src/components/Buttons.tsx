import React from 'react';

interface ButtonProps {
  onClick: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  text?: string;
  type: 'white' | 'pink';
  size?: 'default' |'small';
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ onClick, text, type, size = 'default', children }) => {
  const baseStyles = 'px-24 py-3 rounded-[15px] transition duration-300';
  const sizeStyles = size === 'small' ? 'px-4 py-1' : 'px-24 py-3';
  const whiteButtonStyles = 'bg-white text-black hover:bg-gray-100';
  const pinkButtonStyles = 'bg-[#FF7F7F] text-white hover:bg-[#FF6B6B]';

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles} ${type === 'white' ? whiteButtonStyles : pinkButtonStyles}`}>
      {children || text}
    </button>
  );
};

export default Button;
