// Utility functions

function createBoard() {
    const board = [];
    for (let i = 0; i < 3; i++) {
        board.push(new Array(3).fill(null));
    }
    return board;
}

function checkWinner(board) {
    const lines = [
        // Rows
        [board[0][0], board[0][1], board[0][2]],
        [board[1][0], board[1][1], board[1][2]],
        [board[2][0], board[2][1], board[2][2]],
        // Columns
        [board[0][0], board[1][0], board[2][0]],
        [board[0][1], board[1][1], board[2][1]],
        [board[0][2], board[1][2], board[2][2]],
        // Diagonals
        [board[0][0], board[1][1], board[2][2]],
        [board[0][2], board[1][1], board[2][0]],
    ];

    for (let line of lines) {
        if (line[0] && line[0] === line[1] && line[1] === line[2]) {
            return line[0];
        }
    }

    return null;
}

function isBoardFull(board) {
    return board.every(row => row.every(cell => cell !== null));
}

function minimax(board, depth, isMaximizing, playerSymbol, computerSymbol) {
    const winner = checkWinner(board);
    if (winner === computerSymbol) return 10 - depth;
    if (winner === playerSymbol) return depth - 10;
    if (isBoardFull(board)) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (!board[row][col]) {
                    board[row][col] = computerSymbol;
                    const score = minimax(board, depth + 1, false, playerSymbol, computerSymbol);
                    board[row][col] = null;
                    bestScore = Math.max(score, bestScore);
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (!board[row][col]) {
                    board[row][col] = playerSymbol;
                    const score = minimax(board, depth + 1, true, playerSymbol, computerSymbol);
                    board[row][col] = null;
                    bestScore = Math.min(score, bestScore);
                }
            }
        }
        return bestScore;
    }
}

function bestMove(board, playerSymbol, computerSymbol) {
    let bestScore = -Infinity;
    let move;
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (!board[row][col]) {
                board[row][col] = computerSymbol;
                const score = minimax(board, 0, false, playerSymbol, computerSymbol);
                board[row][col] = null;
                if (score > bestScore) {
                    bestScore = score;
                    move = { row, col };
                }
            }
        }
    }
    return move;
}

function randomFirstMove(board) {
    let emptyCells = [];
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (!board[row][col]) emptyCells.push([row, col]);
        }
    }
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return { row: emptyCells[randomIndex][0], col: emptyCells[randomIndex][1] };
}

// Game logic
class Game {
    constructor() {
        this.board = createBoard();
        this.currentPlayer = 'X';
        this.isGameOver = false;
        this.playerSymbol = 'X';
        this.computerSymbol = 'O';
        this.isFirstMove = true;
        this.init();
    }

    init() {
        const cells = document.querySelectorAll('[data-cell]');
        cells.forEach((cell, index) => {
            cell.addEventListener('click', () => this.makeMove(Math.floor(index / 3), index % 3));
        });

        const resetButton = document.getElementById('reset-button');
        resetButton.addEventListener('click', () => this.reset());

        this.askPlayerSymbol();
    }

    askPlayerSymbol() {
        this.showDialog(
            'Choose your symbol:',
            `<button onclick="game.setPlayerSymbol('X')">X</button>
             <button onclick="game.setPlayerSymbol('O')">O</button>`
        );
    }

    setPlayerSymbol(symbol) {
        this.playerSymbol = symbol;
        this.computerSymbol = this.playerSymbol === 'X' ? 'O' : 'X';
        document.querySelector('.dialog').remove();

        if (this.playerSymbol === 'O') {
            this.makeComputerMove();
        }
    }

    reset() {
        this.board = createBoard();
        this.currentPlayer = 'X';
        this.isGameOver = false;
        this.isFirstMove = true;
        this.updateBoardUI();
        this.updateStatusUI(`Player ${this.currentPlayer}'s turn`);
        this.askPlayerSymbol(); // Ask for player symbol again on reset
    }

    makeMove(row, col) {
        if (this.board[row][col] || this.isGameOver) return;

        this.board[row][col] = this.currentPlayer;
        this.updateBoardUI();

        const winner = checkWinner(this.board);
        if (winner) {
            this.isGameOver = true;
            this.showDialog(`Player ${winner} wins!`);
        } else if (isBoardFull(this.board)) {
            this.isGameOver = true;
            this.showDialog(`It's a draw!`);
        } else {
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            if (this.currentPlayer === this.computerSymbol) {
                this.makeComputerMove();
            } else {
                this.updateStatusUI(`Player ${this.currentPlayer}'s turn`);
            }
        }
    }

    makeComputerMove() {
        let move;
        if (this.computerSymbol === 'X' && this.isFirstMove) {
            move = randomFirstMove(this.board);
            this.isFirstMove = false;
        } else {
            move = bestMove(this.board, this.playerSymbol, this.computerSymbol);
        }
        this.makeMove(move.row, move.col);
    }

    updateBoardUI() {
        const cells = document.querySelectorAll('[data-cell]');
        cells.forEach((cell, index) => {
            const row = Math.floor(index / 3);
            const col = index % 3;
            if (this.board[row][col] === 'X') {
                cell.innerHTML = `<img src="../../assets/x.svg" alt="X" width=50px height=50px>`;
            } else if (this.board[row][col] === 'O') {
                cell.innerHTML = `<img src="../../assets/o.svg" alt="O" width=50px height=50px>`;
            } else {
                cell.innerHTML = '';
            }
        });
    }

    updateStatusUI(message) {
        const statusElement = document.getElementById('status');
        if (statusElement) {
            statusElement.textContent = message;
        }
    }

    showDialog(message, buttons = '<button onclick="document.querySelector(\'.dialog\').remove();">OK</button>') {
        const dialogBox = document.createElement('div');
        dialogBox.classList.add('dialog', 'show');
        dialogBox.innerHTML = `
            <p>${message}</p>
            ${buttons}
        `;
        document.querySelector('.game-top').appendChild(dialogBox);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});