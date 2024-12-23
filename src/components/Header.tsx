import React from 'react';

interface HeaderProps {
  logoSrc: string;
  userName?: string;
}

const Header: React.FC<HeaderProps> = ({ logoSrc, userName }) => {
  return (
    <header className="p-4 bg-white text-black flex justify-between items-center shadow-md">
      <div className="flex items-center">
        <img src={logoSrc} alt="Logo" className="h-20 w-auto" />
      </div>
      {userName && <p className="text-sm">Welcome, {userName}!</p>}
    </header>
  );
};

export default Header;
