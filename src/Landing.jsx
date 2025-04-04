import React from 'react';
import { useNavigate } from 'react-router-dom';
import Computer from './Computer';
import App from './App';
const Landing = () => {

  const navigate = useNavigate();

  const handlePvP = () => {
    // Handle Player vs Player game start
    console.log('Starting Player vs Player game');
    navigate('/app')
  };

  const handlePvC = () => {
    // Handle Player vs Computer game start
    console.log('Starting Player vs Computer game');
    navigate('/computer')
  };

  return (
    <div className="min-h-screen landing-bg flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-amber-200 p-4">
  {/* Simple checkerboard pattern in background */}
  <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-5 pointer-events-none">
    {Array(64).fill().map((_, i) => (
      <div key={i} className={`${(Math.floor(i/8) + i%8) % 2 === 0 ? 'bg-amber-900' : 'bg-amber-100'}`}></div>
    ))}
  </div>

  {/* Title */}
  <h1 className="text-7xl font-extrabold text-amber-400 mb-16">Checkers</h1>
  
  {/* Buttons */}
  <div className="flex flex-col space-y-4 w-full max-w-xs">
    <button
      onClick={handlePvP}
      className="bg-blue-500 hover:bg-blue-600 text-white text-xl font-semibold px-6 py-4 rounded-lg 
      transition-all duration-200 shadow-md"
    >
      Player vs Player
    </button>
    
    <button
      onClick={handlePvC}
      className="bg-green-500 hover:bg-green-600 text-white text-xl font-semibold px-6 py-4 rounded-lg 
      transition-all duration-200 shadow-md"
    >
      Player vs Computer
    </button>
  </div>
</div>
  );
};

export default Landing;