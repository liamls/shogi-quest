import React, { useState, useEffect } from "react";
import getValidMoves from "../utils/pieceMoves";
import initialBoard from "../utils/initialBoard";

const pieceDescriptions = {
  R: {
    name: "Roi",
    description: "Se déplace d'une case dans n'importe quelle direction.",
  },
  T: {
    name: "Tour",
    description: "Se déplace verticalement ou horizontalement sans limite.",
  },
  P: {
    name: "Pion",
    description:
      "Se déplace d'une case en avant et capture de la même manière.",
  },
  L: {
    name: "Lance",
    description: "Se déplace comme une Tour, mais ne peut pas reculer.",
  },
  C: {
    name: "Cavalier",
    description: "Bondit vers l'avant comme un Cavalier d'échecs.",
  },
  A: {
    name: "Général d'Argent",
    description: "Se déplace d'un pas vers l'avant ou en diagonale.",
  },
  O: {
    name: "Général d'Or",
    description:
      "Se déplace d'un pas dans toutes les directions sauf en diagonale.",
  },
};

const Shogi = () => {
  const [board, setBoard] = useState(initialBoard);
  const [turn, setTurn] = useState(1);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [validPositions, setValidPositions] = useState([]);
  const [winner, setWinner] = useState(null);
  const [pieceInfo, setPieceInfo] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);

  const isValid = (row, col) => {
    const piece = board[row][col];
    return turn === 1
      ? piece === piece?.toUpperCase()
      : piece === piece?.toLowerCase();
  };

  const getPieceInfo = (piece) => {
    return pieceDescriptions[piece.toUpperCase()];
  };

  useEffect(() => {
    if (selectedPiece) {
      const moves = getValidMoves(
        selectedPiece.row,
        selectedPiece.col,
        board[selectedPiece.row][selectedPiece.col],
        turn,
        board
      );
      setValidPositions(moves);
      setPieceInfo(getPieceInfo(board[selectedPiece.row][selectedPiece.col]));
    } else {
      setValidPositions([]);
      setPieceInfo(null);
    }
  }, [selectedPiece, turn, board]);

  const handlePieceSelection = (selectedRow, selectedCol) => {
    if (
      selectedPiece &&
      selectedPiece.row === selectedRow &&
      selectedPiece.col === selectedCol
    ) {
      setSelectedPiece(null);
      return;
    }
    if (isValid(selectedRow, selectedCol)) {
      setSelectedPiece({ row: selectedRow, col: selectedCol });
    } else if (
      validPositions.some(
        (pos) => pos.row === selectedRow && pos.col === selectedCol
      )
    ) {
      capturePiece(selectedRow, selectedCol);
    }
  };

  const capturePiece = (row, col) => {
    const newBoard = board.map((r) => r.slice());
    const capturedPiece = newBoard[row][col];
    newBoard[row][col] = board[selectedPiece.row][selectedPiece.col];
    newBoard[selectedPiece.row][selectedPiece.col] = null;

    const opponentKingPosition = findOpponentKingPosition();
    if (!isInCheck(opponentKingPosition, newBoard)) {
      setBoard(newBoard);
      setTurn(turn === 1 ? 2 : 1);
      setMoveHistory([
        ...moveHistory,
        { from: selectedPiece, to: { row, col }, piece: capturedPiece },
      ]);
      setSelectedPiece(null);
      setValidPositions([]);
    } else {
      setWinner(turn === 1 ? 1 : 2);
    }
  };

  const handleMove = (row, col) => {
    if (validPositions.some((pos) => pos.row === row && pos.col === col)) {
      const newBoard = board.map((r) => r.slice());
      newBoard[row][col] = board[selectedPiece.row][selectedPiece.col];
      newBoard[selectedPiece.row][selectedPiece.col] = null;
      setBoard(newBoard);
      setTurn(turn === 1 ? 2 : 1);
      setMoveHistory([
        ...moveHistory,
        { from: selectedPiece, to: { row, col }, piece: null },
      ]);
      setSelectedPiece(null);
      setValidPositions([]);
      setPieceInfo(null);
    }
  };

  const handleClick = (row, col) => {
    if (board[row][col]) {
      handlePieceSelection(row, col);
    } else if (selectedPiece) {
      handleMove(row, col);
    }
  };

  const findOpponentKingPosition = () => {
    const kingSymbol = turn === 1 ? "r" : "R";
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === kingSymbol) return { row: r, col: c };
      }
    }
  };

  const isInCheck = (kingPosition) => {
    return validPositions.some(
      (pos) => pos.row === kingPosition.row && pos.col === kingPosition.col
    );
  };

  return (
    <div
      className={`flex min-h-screen ${
        turn === 1 ? "bg-gray-800" : "bg-gray-600"
      }`}
    >
      <div className="flex flex-col items-center justify-center w-3/4">
        {!winner && (
          <h2 className="text-2xl font-bold mb-4 text-white">
            Tour du Joueur {turn}
          </h2>
        )}
        {winner && (
          <h2 className="text-4xl font-bold mb-4 text-red-400">
            Joueur {winner} a gagné !
          </h2>
        )}
        <div className="grid grid-cols-9 gap-1">
          {board.map((row, rowIndex) =>
            row.map((piece, colIndex) => {
              const isSelected =
                selectedPiece?.row === rowIndex &&
                selectedPiece?.col === colIndex;
              const isValidMove = validPositions.some(
                (pos) => pos.row === rowIndex && pos.col === colIndex
              );
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleClick(rowIndex, colIndex)}
                  className={`cursor-pointer hover:font-bold w-12 h-12 flex items-center justify-center border-2 border-gray-400 transition-transform duration-200 ease-in-out transform ${
                    isSelected ? "bg-yellow-500 scale-110" : ""
                  } ${isValidMove ? "bg-green-500 scale-110" : ""} text-white`}
                >
                  {piece}
                </div>
              );
            })
          )}
        </div>
        <button
          onClick={() => {
            setBoard(initialBoard);
            setSelectedPiece(null);
            setTurn(1);
            setWinner(null);
            setMoveHistory([]);
          }}
          className="m-3 bg-red-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
        >
          Reset
        </button>
      </div>
      <div className="w-1/4 p-4 bg-gray-700 rounded-lg shadow-lg m-4 border border-gray-600">
        <h3 className="text-lg font-bold mb-2 text-white">
          Historique des Coups
        </h3>
        <ul className="max-h-40 overflow-y-auto">
          {moveHistory.map((move, index) => (
            <li
              key={index}
              className="border-b border-gray-600 py-1 text-white"
            >
              {`De (${move.from.row}, ${move.from.col}) à (${move.to.row}, ${
                move.to.col
              }) ${move.piece ? `- Pièce capturée: ${move.piece}` : ""}`}
            </li>
          ))}
        </ul>
        {pieceInfo && (
          <div className="mt-4 border-t border-gray-600 pt-2 text-white">
            <h4 className="font-semibold">{pieceInfo.name}</h4>
            <p className="text-gray-300">{pieceInfo.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shogi;
