import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <img src="/logo.png" alt="UnnatiVeer Logo" className="h-8 w-auto" />
      <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        UnnatiVeer
      </span>
    </div>
  );
};

export default Logo;