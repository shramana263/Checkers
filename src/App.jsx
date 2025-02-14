import { useState } from 'react';

const initialBoard = Array(8).fill(null).map((_, row) =>
  Array(8).fill(null).map((_, col) => {
    if ((row + col) % 2 === 1) return null;
    if (row < 3) return { color: 'black', isKing: false };
    if (row > 4) return { color: 'red', isKing: false };
    return null;
  })
);

function App() {
  const [board, setBoard] = useState(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('red');
  const [possibleMoves, setPossibleMoves] = useState([]);

  const getPossibleMoves = (row, col) => {
    const piece = board[row][col];
    const moves = [];
    const directions = piece.isKing
      ? [[-1, -1], [-1, 1], [1, -1], [1, 1]]
      : piece.color === 'red'
        ? [[-1, -1], [-1, 1]]
        : [[1, -1], [1, 1]];

    // Regular moves
    directions.forEach(([dr, dc]) => {
      const newRow = row + dr;
      const newCol = col + dc;
      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8 && !board[newRow][newCol]) {
        moves.push({ row: newRow, col: newCol });
      }
    });

    // Capture moves
    directions.forEach(([dr, dc]) => {
      const newRow = row + dr * 2;
      const newCol = col + dc * 2;
      const jumpRow = row + dr;
      const jumpCol = col + dc;

      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        const jumpPiece = board[jumpRow]?.[jumpCol];
        if (jumpPiece && jumpPiece.color !== piece.color && !board[newRow][newCol]) {
          moves.push({ row: newRow, col: newCol, captured: { row: jumpRow, col: jumpCol } });
        }
      }
    });

    return moves;
  };

  const handleSquareClick = (row, col) => {
    const piece = board[row][col];
    
    if (selectedPiece === null) {
      if (piece && piece.color === currentPlayer) {
        setSelectedPiece({ row, col });
        setPossibleMoves(getPossibleMoves(row, col));
      }
    } else {
      const move = possibleMoves.find(m => m.row === row && m.col === col);
      if (move) {
        const newBoard = board.map(row => [...row]);
        const movedPiece = newBoard[selectedPiece.row][selectedPiece.col];
        
        // Check for king promotion
        const isKing = movedPiece.isKing || 
          (movedPiece.color === 'red' && row === 0) || 
          (movedPiece.color === 'black' && row === 7);

        newBoard[row][col] = {
          ...movedPiece,
          isKing: isKing
        };
        newBoard[selectedPiece.row][selectedPiece.col] = null;

        if (move.captured) {
          newBoard[move.captured.row][move.captured.col] = null;
        }

        setBoard(newBoard);
        setCurrentPlayer(currentPlayer === 'red' ? 'black' : 'red');
        setSelectedPiece(null);
        setPossibleMoves([]);
      } else if (piece && piece.color === currentPlayer) {
        setSelectedPiece({ row, col });
        setPossibleMoves(getPossibleMoves(row, col));
      } else {
        setSelectedPiece(null);
        setPossibleMoves([]);
      }
    }
  };
  const CrownIcon = () => (
    <svg 
      className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-yellow-500"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3H5v2h14v-2z"
        fill="currentColor"
      />
    </svg>
  );

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="grid grid-cols-8 gap-0">
        {board.map((row, rowIndex) =>
          row.map((square, colIndex) => {
            const isDarkSquare = (rowIndex + colIndex) % 2 === 1;
            const isSelected = selectedPiece && selectedPiece.row === rowIndex && selectedPiece.col === colIndex;
            const isPossibleMove = possibleMoves.some(move => move.row === rowIndex && move.col === colIndex);
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`h-16 w-16 flex items-center justify-center ${isDarkSquare ? 'bg-gray-800' : 'bg-amber-100'} ${isSelected ? 'border-4 border-blue-500' : ''} ${isPossibleMove ? ' bg-green-500' : ''}`}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
              >
                {square && (
                  <div className={`relative h-12 w-12 rounded-full ${square.color === 'red' ? 'bg-red-600' : 'bg-black'} ${square.isKing ? 'ring-2 ring-yellow-500' : ''} shadow-[0_2px_5px_rgba(0,0,0,0.3)]`}>
                    <div className="absolute inset-0 rounded-full bg-white/10 mix-blend-overlay"></div>
                    <div className="absolute inset-0 rounded-full border-2 border-white/20"></div>
                    {square.isKing && <CrownIcon />}
                  </div>)}

              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default App;