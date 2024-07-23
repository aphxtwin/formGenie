import React from 'react';

interface GradientButtonProps {
    onClick: () => void; // Add other props as needed
  }


const GradientButton: React.FC<GradientButtonProps> = ({ onClick }) => {
  return (
<button onClick={onClick} className="w-[55px] h-[49px] bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 rounded-xl shadow-lg flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:scale-105 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
      <div className="flex flex-col space-y-1.5">
        <div className="w-5 h-0.5 bg-white rounded-full transition-all duration-300 group-hover:w-6"></div>
        <div className="w-6 h-0.5 bg-white rounded-full"></div>
        <div className="w-5 h-0.5 bg-white rounded-full transition-all duration-300 group-hover:w-6"></div>
      </div>
    </button>
  );
};

export default GradientButton;