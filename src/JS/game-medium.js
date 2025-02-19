import { createBoard, checkWinner, isBoardFull, randomMove, Score } from './utils.js';

function findWinningMove(board, symbol) {
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (!board[row][col]) {
                board[row][col] = symbol;
                if (checkWinner(board) === symbol) {
                    board[row][col] = null;
                    return { row, col };
                }
                board[row][col] = null;
            }
        }
    }
    return null;
}

function mediumAIMove(board, playerSymbol, computerSymbol) {
    // Check if the computer can win in the next move
    let winningMove = findWinningMove(board, computerSymbol);
    if (winningMove) {
        return winningMove;
    }

    // Check if the player can win in the next move and block them
    let blockingMove = findWinningMove(board, playerSymbol);
    if (blockingMove) {
        return blockingMove;
    }

    // Otherwise, make a random move
    return randomMove(board);
}

// Game logic
class Game {
    constructor() {
        this.board = createBoard();
        this.currentPlayer = 'X';
        this.isGameOver = false;
        this.playerSymbol = 'X';
        this.computerSymbol = 'O';
        this.score = new Score();
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
            if (winner === this.playerSymbol) {
                this.score.incrementPlayerScore('user');
            } else {
                this.score.incrementPlayerScore('computer');
            }
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
        const { row, col } = mediumAIMove(this.board, this.playerSymbol, this.computerSymbol);
        this.makeMove(row, col);
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