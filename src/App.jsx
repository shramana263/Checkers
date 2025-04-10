import { useState } from 'react';
import Instruction from './components/Instruction';

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
  const [isInstructionOpen, setInstructionOpen] = useState(false);
  const [gameStatus, setGameStatus] = useState(null);
  const [deadlockMsg, setDeadlockMsg]= useState('');

  const getPossibleMoves = (row, col, currentBoard) => {
    const piece = currentBoard[row][col];
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
      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8 && !currentBoard[newRow][newCol]) {
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
        const jumpPiece = currentBoard[jumpRow]?.[jumpCol];
        if (jumpPiece && jumpPiece.color !== piece.color && !currentBoard[newRow][newCol]) {
          moves.push({ row: newRow, col: newCol, captured: { row: jumpRow, col: jumpCol } });
        }
      }
    });

    return moves;
  };

  const hasAnyValidMoves = (player, currentBoard) => {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = currentBoard[row][col];
        if (piece && piece.color === player) {
          const moves = getPossibleMoves(row, col, currentBoard);
          if (moves.length > 0) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const checkGameOver = (nextPlayer, newBoard) => {
    const hasPieces = newBoard.flat().some(piece => piece && piece.color === nextPlayer);
    if (!hasPieces) {
      setGameStatus(`${currentPlayer} Wins`);
      return;
    }
    const hasMoves = hasAnyValidMoves(nextPlayer, newBoard);
    if (!hasMoves && hasPieces) {
      // setGameStatus(currentPlayer);
      setDeadlockMsg('No More Possible Moves');
      console.log('No More Possible Moves');
      setGameStatus('Draw');
    }
  };

  const handleSquareClick = (row, col) => {
    if (gameStatus) return;

    const piece = board[row][col];

    if (selectedPiece === null) {
      if (piece && piece.color === currentPlayer) {
        setSelectedPiece({ row, col });
        setPossibleMoves(getPossibleMoves(row, col, board));
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
        const nextPlayer = currentPlayer === 'red' ? 'black' : 'red';
        setCurrentPlayer(nextPlayer);
        setSelectedPiece(null);
        setPossibleMoves([]);

        checkGameOver(nextPlayer, newBoard);
      } else if (piece && piece.color === currentPlayer) {
        setSelectedPiece({ row, col });
        setPossibleMoves(getPossibleMoves(row, col, board));
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
    <div className="flex flex-col justify-center items-center gap-3 h-screen checkers-background">
      <div className='font-bold text-3xl flex justify-center items-center gap-5'>
        <div>Turn :</div>
        <div className={`relative h-12 w-12 rounded-full ${currentPlayer === 'red' ? 'bg-red-700' : 'bg-black'} shadow-[0_2px_5px_rgba(0,0,0,0.3)] `}>
          <div className="absolute inset-0 rounded -full bg-white/20 mix-blend-overlay"></div>
          <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
        </div>
      </div>
      <div className="grid grid-cols-8 gap-0 border-8 border-gray-700 rounded-md">
        {board.map((row, rowIndex) =>
          row.map((square, colIndex) => {
            const isDarkSquare = (rowIndex + colIndex) % 2 === 1;
            const isSelected = selectedPiece && selectedPiece.row === rowIndex && selectedPiece.col === colIndex;
            const isPossibleMove = possibleMoves.some(move => move.row === rowIndex && move.col === colIndex);
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`h-16 w-16 hover:cursor-pointer flex items-center justify-center ${isDarkSquare ? 'bg-gray-800' : 'bg-amber-100'} ${isSelected ? 'border-4 border-blue-500' : ''} ${isPossibleMove ? ' bg-green-500' : ''}`}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
              >
                {square && (
                  <div className={`relative h-12 w-12 rounded-full  ${square.color === 'red' ? 'bg-red-700' : 'bg-black'} ${square.isKing ? 'ring-2 ring-yellow-500' : ''} shadow-[0_2px_5px_rgba(0,0,0,0.3)]`}>
                    <div className="absolute inset-0 rounded-full bg-white/20 mix-blend-overlay"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
                    {square.isKing && <CrownIcon />}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      <button
        onClick={() => setInstructionOpen(true)}
        className="fixed bottom-4 right-4 bg-green-700 hover:bg-green-800 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-2xl transition-all"
      >
        ?
      </button>

      <Instruction
        isOpen={isInstructionOpen}
        onClose={() => setInstructionOpen(false)}
      />

      {gameStatus != null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">{gameStatus}</h2>
            <button
              onClick={() => {
                setBoard(initialBoard);
                setCurrentPlayer('red');
                setGameStatus(null);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;