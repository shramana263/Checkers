import { useState, useEffect } from 'react';

const createBoard = () => 
  Array(8).fill(null).map((_, row) => 
    Array(8).fill(null).map((_, col) => ({
      color: (row + col) % 2 === 0 ? 'white' : 'black',
      piece: null,
      isKing: false,
    }))
  );

const initializeBoard = () => {
  const board = createBoard();
  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell.color === 'black') {
        if (rowIndex < 3) cell.piece = 'red';
        if (rowIndex > 4) cell.piece = 'black';
      }
    });
  });
  return board;
};

const Computer = () => {
  const [board, setBoard] = useState(initializeBoard());
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('red');
  const [gameOver, setGameOver] = useState(false);
  const [computerThinking, setComputerThinking] = useState(false);

  const evaluateBoard = (currentBoard) => {
    let score = 0;
    currentBoard.forEach(row => {
      row.forEach(cell => {
        if (cell.piece === 'black') {
          score += cell.isKing ? 5 : 3;
        } else if (cell.piece === 'red') {
          score -= cell.isKing ? 5 : 3;
        }
      });
    });
    return score;
  };

  const getAllMoves = (currentBoard, player) => {
    const jumps = [];
    const regularMoves = [];

    currentBoard.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell.piece === player) {
          const directions = cell.isKing ? [-1, 1] : player === 'red' ? [1] : [-1];
          
          directions.forEach(rowDir => {
            [-1, 1].forEach(colDir => {
              // Check jump moves first
              const jumpRow = rowIndex + (rowDir * 2);
              const jumpCol = colIndex + (colDir * 2);
              if (isValidMove(currentBoard, rowIndex, colIndex, jumpRow, jumpCol, player)) {
                jumps.push({ from: [rowIndex, colIndex], to: [jumpRow, jumpCol] });
              }

              // Check regular moves
              const newRow = rowIndex + rowDir;
              const newCol = colIndex + colDir;
              if (isValidMove(currentBoard, rowIndex, colIndex, newRow, newCol, player )) {
                regularMoves.push({ from: [rowIndex, colIndex], to: [newRow, newCol] });
              }
            });
          });
        }
      });
    });

    // Return jumps if any, otherwise regular moves
    return jumps.length > 0 ? jumps : regularMoves;
  };

  const minimax = (currentBoard, depth, alpha, beta, maximizingPlayer) => {
    if (depth === 0 || checkGameOver(currentBoard)) {
      return { score: evaluateBoard(currentBoard) };
    }

    const player = maximizingPlayer ? 'black' : 'red';
    const moves = getAllMoves(currentBoard, player);

    if (maximizingPlayer) {
      let maxEval = -Infinity;
      let bestMove = null;

      for (const move of moves) {
        const newBoard = simulateMove(currentBoard, move);
        const evaluation = minimax(newBoard, depth - 1, alpha, beta, false).score;
        if (evaluation > maxEval) {
          maxEval = evaluation;
          bestMove = move;
        }
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) break;
      }
      return { score: maxEval, move: bestMove };
    } else {
      let minEval = Infinity;
      let bestMove = null;

      for (const move of moves) {
        const newBoard = simulateMove(currentBoard, move);
        const evaluation = minimax(newBoard, depth - 1, alpha, beta, true).score;
        if (evaluation < minEval) {
          minEval = evaluation;
          bestMove = move;
        }
        beta = Math.min(beta, evaluation);
        if (beta <= alpha) break;
      }
      return { score: minEval, move: bestMove };
    }
  };

  const simulateMove = (currentBoard, move) => {
    const newBoard = currentBoard.map(row => row.map(cell => ({ ...cell })));
    const [startRow, startCol] = move.from;
    const [endRow, endCol] = move.to;
    const piece = newBoard[startRow][startCol].piece;

    newBoard[endRow][endCol].piece = piece;
    newBoard[endRow][endCol].isKing = newBoard[startRow][startCol].isKing;
    newBoard[startRow][startCol].piece = null;

    if (Math.abs(endCol - startCol) === 2) {
      const middleRow = (startRow + endRow) / 2;
      const middleCol = (startCol + endCol) / 2;
      newBoard[middleRow][middleCol].piece = null;
    }

    if ((endRow === 7 && piece === 'red') || (endRow === 0 && piece === 'black')) {
      newBoard[endRow][endCol].isKing = true;
    }

    return newBoard;
  };

  const isValidMove = (currentBoard, startRow, startCol, endRow, endCol, player) => {
    if (endRow < 0 || endRow >= 8 || endCol < 0 || endCol >= 8) return false;
    if (currentBoard[endRow][endCol].piece) return false;
    if (currentBoard[endRow][endCol].color !== 'black') return false;

    const rowDiff = endRow - startRow;
    const colDiff = Math.abs(endCol - startCol);
    const piece = currentBoard[startRow][startCol];
    const isKing = piece.isKing;

    if (!isKing && ((player === 'red' && rowDiff <= 0) || (player === 'black' && rowDiff >= 0))) {
      return false;
    }

    if (colDiff === 1) {
      return Math.abs(rowDiff) === 1;
    }

    if (colDiff === 2) {
      const middleRow = (startRow + endRow) / 2;
      const middleCol = (startCol + endCol) / 2;
      const middlePiece = currentBoard[middleRow][middleCol].piece;

      if (Math.abs(rowDiff) !== 2) return false;
      if (!middlePiece || middlePiece === player) return false;
      return true;
    }

    return false;
  };

  const handleMove = (startRow, startCol, endRow, endCol) => {
    const newBoard = simulateMove(board, { from: [startRow, startCol], to: [endRow, endCol] });
    setBoard(newBoard);
    setSelectedPiece(null);
    checkGameOver(newBoard);
    setCurrentPlayer(prev => prev === 'red' ? 'black' : 'red');
  };

  const checkGameOver = (currentBoard) => {
    const redPieces = currentBoard.flat().filter(cell => cell.piece === 'red').length;
    const blackPieces = currentBoard.flat().filter(cell => cell.piece === 'black').length;
    if (redPieces === 0 || blackPieces === 0) setGameOver(true);
  };

  const computerMove = async () => {
    setComputerThinking(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const { move } = minimax(board, 3, -Infinity, Infinity, true);
    
    if (move) {
      setTimeout(() => {
        handleMove(...move.from, ...move.to);
        setComputerThinking(false);
      }, 1000);
    }
  };

  useEffect(() => {
    if (currentPlayer === 'black' && !gameOver && !computerThinking) {
      computerMove();
    }
  }, [currentPlayer, gameOver, computerThinking]);

  const handleSquareClick = (row, col) => {
    if (gameOver || currentPlayer === 'black' || computerThinking) return;

    if (board[row][col].piece === 'red') {
      setSelectedPiece([row, col]);
      return;
    }

    if (selectedPiece) {
      const [startRow, startCol] = selectedPiece;
      if (isValidMove(board, startRow, startCol, row, col, 'red')) {
        handleMove(startRow, startCol, row, col);
      }
    }
  };

  const resetGame = () => {
    setBoard(initializeBoard());
    setSelectedPiece(null);
    setCurrentPlayer('red');
    setGameOver(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="mb-4 text-xl font-bold">
        {gameOver ? (
          <div className="text-red-600">
            Game Over! 
            <button onClick={resetGame} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
              Play Again
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span>Current Player: {currentPlayer === 'red' ? 'Human' : 'Computer'}</span>
            {computerThinking && (
              <div className="w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
            )}
          </div>
        )}
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <div className="grid grid-cols-8 gap-0 border-2 border-yellow-600">
          {board.map((row, rowIndex) => row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`h-16 w-16 flex items-center justify-center cursor-pointer
                ${cell.color === 'black' ? 'bg-yellow-700' : 'bg-gray-100'}
                ${selectedPiece?.[0] === rowIndex && selectedPiece?.[1] === colIndex ? 'ring-4 ring-blue-400' : ''}
                ${!cell.piece && cell.color === 'black' ? 'hover:bg-gray-700' : ''}
                ${computerThinking ? 'opacity-75 cursor-not-allowed' : ''}`}
              onClick={() => handleSquareClick(rowIndex, colIndex)}
            >
              {cell.piece && (
                <div className={`h-12 w-12 rounded-full ${cell.piece === 'red' ? 'bg-red-500' : 'bg-black'} 
                  flex items-center justify-center text-white relative
                  ${cell.isKing ? "after:content-['♔'] after:text-xl after:absolute" : ''}`}
                />
              )}
            </div>
          )))}
        </div>
      </div>
    </div>
  );
};

export default Computer;