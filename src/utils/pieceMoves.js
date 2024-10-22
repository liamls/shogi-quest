const getValidMoves = (row, col, piece, player, board) => {
  const moves = [];
  const direction = player === 1 ? 1 : -1;

  const isInBounds = (r, c) => r >= 0 && r < 9 && c >= 0 && c < 9;
  const isEmpty = (r, c) => !board[r][c];
  const isEnemy = (r, c) =>
    board[r][c] && player === 1
      ? board[r][c]?.toLowerCase() === board[r][c]
      : board[r][c]?.toUpperCase() === board[r][c];

  const addMove = (r, c) => {
    if (isInBounds(r, c)) {
      if (isEmpty(r, c)) {
        moves.push({ row: r, col: c });
        return true; 
      } else if (isEnemy(r, c)) {
        moves.push({ row: r, col: c });
        return false; 
      }
    }
    return false;
  };

  const moveKing = () => {
    for (let r = -1; r <= 1; r++) {
      for (let c = -1; c <= 1; c++) {
        if (r === 0 && c === 0) continue;
        addMove(row + r, col + c);
      }
    }
  };

  const moveRook = () => {
    for (let i = 1; i < 9; i++) {
      if (!addMove(row + i, col)) break; 
    }
    for (let i = 1; i < 9; i++) {
      if (!addMove(row - i, col)) break; 
    }
    for (let i = 1; i < 9; i++) {
      if (!addMove(row, col + i)) break; 
    }
    for (let i = 1; i < 9; i++) {
      if (!addMove(row, col - i)) break; 
    }
  };

  const movePawn = () => {
    if (isInBounds(row + direction, col) && isEmpty(row + direction, col)) {
      addMove(row + direction, col); 
    }
    
    if (
      isInBounds(row + direction, col - 1) &&
      isEnemy(row + direction, col - 1)
    ) {
      addMove(row + direction, col - 1); 
    }
    if (
      isInBounds(row + direction, col + 1) &&
      isEnemy(row + direction, col + 1)
    ) {
      addMove(row + direction, col + 1); 
    }
  };

  const moveLance = () => {
    for (let i = 1; i < 9; i++) {
      if (!addMove(row + i * direction, col)) break; 
    }
  };

  const moveKnight = () => {
    const movesToCheck = [
      { r: row + direction, c: col - 1 },
      { r: row + direction, c: col + 1 },
    ];
    movesToCheck.forEach(({ r, c }) => addMove(r, c));
  };

  const moveSilverGeneral = () => {
    const directions = [
      { r: direction, c: -1 },
      { r: direction, c: 0 },
      { r: direction, c: 1 },
      { r: -direction, c: -1 },
    ];
    directions.forEach(({ r, c }) => addMove(row + r, col + c));
  };

  const moveGoldGeneral = () => {
    const directions = [
      { r: direction, c: 0 },
      { r: -direction, c: 0 },
      { r: 0, c: -1 },
      { r: 0, c: 1 },
    ];
    directions.forEach(({ r, c }) => addMove(row + r, col + c));
  };

  const moveBishop = () => {
    for (let i = 1; i < 9; i++) {
      if (!addMove(row - i, col - i)) break; 
    }
    for (let i = 1; i < 9; i++) {
      if (!addMove(row - i, col + i)) break; 
    }
    for (let i = 1; i < 9; i++) {
      if (!addMove(row + i, col - i)) break; 
    }
    for (let i = 1; i < 9; i++) {
      if (!addMove(row + i, col + i)) break; 
    }
  };

  switch (piece.toLowerCase()) {
    case "r":
      moveKing();
      break;
    case "t":
      moveRook();
      break;
    case "p":
      movePawn();
      break;
    case "l":
      moveLance();
      break;
    case "c":
      moveKnight();
      break;
    case "a":
      moveSilverGeneral();
      break;
    case "o":
      moveGoldGeneral();
      break;
    case "f":
      moveBishop();
      break;
    default:
      break;
  }

  return moves;
};

export default getValidMoves;
