import React from 'react';
import { useNavigate } from 'react-router-dom';
import Computer from './Computer';
import App from './App';
const Landing = () => {

  const navigate= useNavigate();

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
    <div className="min-h-screen landing-bg flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl font-bold text-slate-800 mb-12 absolute top-8">
        Checkers
      </h1>
      
      <div className="flex flex-col space-y-4">
        <button
          onClick={handlePvP}
          className="bg-blue-500 hover:bg-blue-600 text-white text-2xl font-semibold px-8 py-4 rounded-lg 
          transition-colors duration-200 transform hover:scale-105 active:scale-95"
        >
          Player vs Player
        </button>
        
        <button
          onClick={handlePvC}
          className="bg-green-500 hover:bg-green-600 text-white text-2xl font-semibold px-8 py-4 rounded-lg 
          transition-colors duration-200 transform hover:scale-105 active:scale-95"
        >
          Player vs Computer
        </button>
      </div>
    </div>
  );
};

export default Landing;