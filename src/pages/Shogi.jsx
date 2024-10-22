import { useState, useEffect } from "react";
import getValidMoves from "../utils/pieceMoves";
import initialBoard from "../utils/initialBoard";
import pieceDescriptions from "../utils/pieceDescriptions";

const colors = {
  player1Background: "bg-gray-600", // Couleur de fond du joueur 1 (clair)
  player2Background: "bg-gray-700", // Couleur de fond du joueur 2 (clair)
  boardBackground: "bg-gray-400", // Couleur du plateau (beige clair)
  selectedPiece: "bg-orange-400", // Couleur pour les pièces sélectionnées (orange vif)
  validMove: "bg-green-400", // Couleur pour les coups valides (vert clair)
  resetButton: "bg-red-600", // Couleur du bouton de réinitialisation (rouge)
  moveHistoryBackground: "bg-gray-500", // Couleur de fond de l'historique des coups (gris clair)
  pieceText: "text-white", // Couleur du texte des pièces (noir)
  historyText: "text-white", // Couleur du texte de l'historique (noir)
  descriptionText: "text-white", // Couleur du texte de description (gris foncé)
  border: "border-gray-500", // Couleur de la bordure (gris)
  borderLight: "border-gray-400", // Couleur de la bordure légère (gris clair)
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
    let pieceToMove = board[selectedPiece.row][selectedPiece.col];
    if (isPromoted(row, turn, selectedPiece)) {
      pieceToMove = promotePiece(pieceToMove);
    }
    const capturedPiece = newBoard[row][col];
    newBoard[row][col] = pieceToMove;
    newBoard[selectedPiece.row][selectedPiece.col] = null;
    const opponentKingPosition = findOpponentKingPosition();
    if (!isInCheck(opponentKingPosition, newBoard)) {
      setBoard(newBoard);
      setTurn(turn === 1 ? 2 : 1);
      setMoveHistory([
        ...moveHistory,
        {
          from: selectedPiece,
          player: turn,
          to: { row, col },
          piece: capturedPiece,
        },
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
      let pieceToMove = board[selectedPiece.row][selectedPiece.col];
      if (isPromoted(row, turn, selectedPiece)) {
        pieceToMove = promotePiece(pieceToMove);
      }
      newBoard[row][col] = pieceToMove;
      newBoard[selectedPiece.row][selectedPiece.col] = null;
      setBoard(newBoard);
      setTurn(turn === 1 ? 2 : 1);
      setMoveHistory([
        ...moveHistory,
        { from: selectedPiece, player: turn, to: { row, col }, piece: null },
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

  const promotionMapping = {
    P: "O", // Pion → Général d'Or
    L: "O", // Lance → Général d'Or
    C: "O", // Cavalier → Général d'Or
    F: "F+", // Fou → Fou promu
    T: "T+", // Tour → Tour promue
  };

  const promotePiece = (piece) => {
    const basePiece = piece.toUpperCase();
    if (promotionMapping[basePiece]) {
      return turn === 1
        ? promotionMapping[basePiece]
        : promotionMapping[basePiece].toLowerCase();
    }
    return piece;
  };

  const isPromoted = (row, player) => {
    if (player === 1 && row > 5) {
      return true;
    } else if (player === 2 && row < 3) {
      return true;
    }
    return false;
  };

  return (
    <div
      className={`flex space-center min-h-screen ${
        turn === 1 ? colors.player1Background : colors.player2Background
      }`}
    >
      <div className="flex flex-col items-center justify-center w-1/2 ml-20">
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

              // Couleur du joueur
              const playerColor = piece
                ? piece === piece.toUpperCase()
                  ? colors.player1Background // Joueur 1 (majuscule)
                  : colors.player2Background // Joueur 2 (minuscule)
                : colors.boardBackground;

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleClick(rowIndex, colIndex)}
                  className={`cursor-pointer hover:font-bold w-12 h-12 flex items-center justify-center border-2 ${
                    colors.border
                  } transition-transform duration-200 ease-in-out transform ${
                    isValidMove
                      ? colors.validMove + " scale-110" // Priorité à validMove
                      : isSelected
                      ? colors.selectedPiece + " scale-110"
                      : playerColor
                  } ${colors.pieceText}`}
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
          className={`m-3 ${colors.resetButton} text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out hover:${colors.resetButtonHover}`}
        >
          Reset
        </button>
      </div>
      <div className="flex flex-col w-1/4">
        <div
          className={`h-3/4 p-4 ${colors.moveHistoryBackground} rounded-lg shadow-lg m-4 border ${colors.borderLight}`}
        >
          <h3 className="text-lg font-bold mb-2 text-white">
            Historique des Coups
          </h3>
          {moveHistory.length === 0 ? (
            <p className={`${colors.historyText} text-center`}>
              Aucune historique disponible
            </p>
          ) : (
            <ul className="list-disc pl-5">
              {moveHistory.map((move, index) => (
                <li key={index} className={`${colors.historyText}`}>
                  Joueur {move.player} : {move.from.row}-{move.from.col} à{" "}
                  {move.to.row}-{move.to.col}
                  {move.piece && ` (Capture ${move.piece})`}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div
          className={`h-1/4 p-4 ${colors.moveHistoryBackground} rounded-lg shadow-lg m-4 border ${colors.borderLight}`}
        >
          {pieceInfo && (
            <div>
              <h4 className={`font-bold text-white`}>{pieceInfo.name}</h4>
              <p className={`${colors.descriptionText}`}>
                {pieceInfo.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shogi;
