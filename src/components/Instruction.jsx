import React from 'react';

const Instruction = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Game Instructions</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4 text-gray-600">
            <div>
              <h3 className="font-semibold text-lg mb-2 text-gray-800">Game Rules:</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>Players take turns moving their pieces diagonally forward</li>
                <li>Capture opponent pieces by jumping over them</li>
                <li>Reach the opposite end to become a King (can move backward)</li>
                <li>Multiple jumps must be completed in a single turn</li>
                <li>First player to capture all opponent pieces wins</li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2 text-gray-800">How to Play:</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Click on your piece to select it</li>
                <li>Click on a highlighted square to move</li>
                <li>Mandatory jumps are automatically enforced</li>
                <li>Game automatically detects wins</li>
              </ul>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-green-700 hover:bg-green-800 hover:cursor-pointer text-white font-medium py-2 px-4 rounded-lg transition-colors mt-4"
            >
              Got it! Let's Play
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instruction;