const boardElement = document.getElementById('board');
let board = [ ['', '', ''], ['', '', ''], ['', '', ''] ];
let currentPlayer = 'X'; //  Human player starts

// Render The Board
function renderBoard() {
  boardElement.innerHTML = '';
  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellElement = document.createElement('div');
      cellElement.classList.add('cell');
      if (cell) cellElement.classList.add('taken');
      cellElement.textContent = cell;
      cellElement.addEventListener('click', () => makeMove(rowIndex, colIndex));
      boardElement.appendChild(cellElement);
    });
  });
}

// Make a move
function makeMove(row, col) {
  if (board[row][col] !== '' || currentPlayer !== 'X') return; // Impedir jogada inválida
  board[row][col] = 'X';
  renderBoard();
  if (checkWinner()) return;

  currentPlayer = 'O';
  aiMove();
}

//  Check Winner
function checkWinner() {
  const winningCombinations = [
    // Linhas
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    // Colunas
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    // Diagonais
    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]]
  ];

  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (
      board[a[0]][a[1]] &&
      board[a[0]][a[1]] === board[b[0]][b[1]] &&
      board[a[0]][a[1]] === board[c[0]][c[1]]
    ) {
      alert(`${board[a[0]][a[1]]} venceu!`);
      resetGame();
      return true;
    }
  }

  if (board.flat().every(cell => cell !== '')) {
    alert('Empate!');
    resetGame();
    return true;
  }

  return false;
}

// Reset The Game
function resetGame() {
  board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  currentPlayer = 'X';
  renderBoard();
}

//  AI movement based on difficulty
function aiMove() {
  const difficulty = document.getElementById('difficulty').value;
  if (difficulty === 'easy') {
    aiMoveEasy();
  } else if (difficulty === 'medium') {
    aiMoveMedium();
  } else {
    aiMoveHard();
  }
  renderBoard();
  if (checkWinner()) return;
  currentPlayer = 'X';
}

//  Easy (Random Plays)
function aiMoveEasy() {
  const availableMoves = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === '') {
        availableMoves.push({ i, j });
      }
    }
  }
  const move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
  board[move.i][move.j] = 'O';
}

// Medium (Blockade and Victory)
function aiMoveMedium() {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === '') {
        // Testa vitória da IA
        board[i][j] = 'O';
        if (isWinner('O')) return;
        board[i][j] = '';

        // Testa bloqueio do jogador
        board[i][j] = 'X';
        if (isWinner('X')) {
          board[i][j] = 'O';
          return;
        }
        board[i][j] = '';
      }
    }
  }
  aiMoveEasy();
}

// Hard (Minimax)
function aiMoveHard() {
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === '') {
        board[i][j] = 'O';
        const score = minimax(board, 0, false, -Infinity, Infinity);
        board[i][j] = '';
        if (score > bestScore) {
          bestScore = score;
          move = { i, j };
        }
      }
    }
  }

  board[move.i][move.j] = 'O';
}

//  Minimax algorithm with alpha-beta pruning
function minimax(board, depth, isMaximizing, alpha, beta) {
  if (isWinner('O')) return 10 - depth;
  if (isWinner('X')) return depth - 10;
  if (board.flat().every(cell => cell !== '')) return 0;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === '') {
          board[i][j] = 'O';
          const eval = minimax(board, depth + 1, false, alpha, beta);
          board[i][j] = '';
          maxEval = Math.max(maxEval, eval);
          alpha = Math.max(alpha, eval);
          if (beta <= alpha) break;
        }
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === '') {
          board[i][j] = 'X';
          const eval = minimax(board, depth + 1, true, alpha, beta);
          board[i][j] = '';
          minEval = Math.min(minEval, eval);
          beta = Math.min(beta, eval);
          if (beta <= alpha) break;
        }
      }
    }
    return minEval;
  }
}

//  Check Winner for Minimax
function isWinner(player) {
  const winningCombinations = [
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]],
  ];

  return winningCombinations.some(combination =>
    combination.every(([x, y]) => board[x][y] === player)
  );
}

renderBoard();
