/*
   Game
    -> Board
        -> Square
    -> History
*/
import { useState } from "react";

function Square({ value, onSquareClick, isWinner }) {
  return (
    <button
      onClick={onSquareClick}
      className={`h-16 w-16 m-1 text-2xl font-bold rounded-lg transition-all duration-200 
      ${
        value === "X"
          ? "text-blue-600"
          : value === "O"
          ? "text-pink-600"
          : "text-gray-700"
      } 
      ${
        isWinner
          ? "bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg shadow-green-500/50"
          : "bg-gray-100 hover:bg-gray-200 active:bg-gray-300 border border-gray-400"
      }`}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo ? winnerInfo.winner : null;
  const winningLine = winnerInfo ? winnerInfo.line : [];

  let status;
  if (winner) {
    status = `🏆 Winner: ${winner}`;
  } else if (!squares.includes(null)) {
    status = "🤝 It's a draw!";
  } else {
    status = "Next Player: " + (xIsNext ? "❌ X" : "⭕ O");
  }

  function handleClick(i) {
    if (squares[i] || winner) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="font-semibold text-2xl mb-4 text-gray-800">{status}</div>

      <div className="grid grid-cols-3">
        {squares.map((sq, i) => (
          <Square
            key={i}
            value={sq}
            isWinner={winningLine.includes(i)}
            onSquareClick={() => handleClick(i)}
          />
        ))}
      </div>
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [xIsNext, setXIsNext] = useState(true);
  const [currentMove, setCurrentMove] = useState(0);

  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function jumpTo(move) {
    setCurrentMove(move);
    setXIsNext(move % 2 === 0);
  }

  const moves = history.map((squares, move) => {
    const description =
      move > 0 ? `Go to move #${move}` : "Restart the game";
    return (
      <li key={move} className="mb-2">
        <button
          onClick={() => jumpTo(move)}
          className="px-3 py-1 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition"
        >
          {description}
        </button>
      </li>
    );
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-100 to-indigo-200 p-6">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6 drop-shadow">
        🎮 Tic Tac Toe
      </h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-300">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-300 h-fit">
          <h2 className="text-xl font-bold mb-3 text-gray-700">Game History</h2>
          <ol>{moves}</ol>
        </div>
      </div>
      <footer className="mt-8 text-gray-600 text-sm">
        Built by <span className="font-semibold text-indigo-600">Nasir 💻</span>
      </footer>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line };
    }
  }
  return null;
}
