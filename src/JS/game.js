import { createBoard, checkWinner, isBoardFull, randomMove } from './utils.js';

class Score {
    constructor(email) {
        this.email = email;
        const savedScores = JSON.parse(localStorage.getItem('scores')) || {};
        const userScores = savedScores[this.email] || { userScore: 0, computerScore: 0 };
        this.userScore = userScores.userScore;
        this.computerScore = userScores.computerScore;
        this.updateScoreUI();
    }

    incrementPlayerScore(player) {
        if (player === 'user') {
            this.userScore++;
        } else if (player === 'computer') {
            this.computerScore++;
        }
        this.saveScores();
        this.updateScoreUI();
    }

    updateScoreUI() {
        document.querySelector('.left-player .player-score').textContent = this.userScore;
        document.querySelector('.right-player .player-score').textContent = this.computerScore;
    }

    saveScores() {
        const savedScores = JSON.parse(localStorage.getItem('scores')) || {};
        savedScores[this.email] = {
            userScore: this.userScore,
            computerScore: this.computerScore,
        };
        localStorage.setItem('scores', JSON.stringify(savedScores));
    }

    resetScores() {
        this.userScore = 0;
        this.computerScore = 0;
        this.saveScores();
        this.updateScoreUI();
    }

    static resetScores(email) {
        const score = new Score(email);
        score.resetScores();
    }
}

class Game {
    constructor(email) {
        console.log("Game initialized in game.js");
        this.email = email;
        this.board = createBoard();
        this.currentPlayer = 'X';
        this.isGameOver = false;
        this.playerX = 'user';
        this.playerO = 'computer';
        this.score = new Score(email);
        this.init();
    }

    init() {
        console.log("Initializing game...");
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
            `<button onclick="window.game.setPlayerSymbol('X')">X</button>
             <button onclick="window.game.setPlayerSymbol('O')">O</button>`
        );
    }

    setPlayerSymbol(symbol) {
        this.playerX = symbol === 'X' ? 'user' : 'computer';
        this.playerO = symbol === 'O' ? 'user' : 'computer';
        document.querySelector('.left-player .player-symbol img').src = symbol === 'X' ? '../../assets/x.svg' : '../../assets/o.svg';
        document.querySelector('.right-player .player-symbol img').src = symbol === 'O' ? '../../assets/x.svg' : '../../assets/o.svg';
        document.querySelector('.dialog').remove();
        this.updateStatusUI(`Player ${this.currentPlayer}'s turn`);
    }

    reset() {
        this.board = createBoard();
        this.currentPlayer = 'X';
        this.isGameOver = false;
        this.updateBoardUI();
        this.askPlayerSymbol();
    }

    makeMove(row, col) {
        if (this.board[row][col] || this.isGameOver) return;

        this.board[row][col] = this.currentPlayer;
        this.updateBoardUI();

        const winner = checkWinner(this.board);
        if (winner) {
            this.isGameOver = true;
            const winningPlayer = winner === 'X' ? this.playerX : this.playerO;
            this.showDialog(`Player ${winningPlayer === 'user' ? '1' : '2'} wins!`);
            this.score.incrementPlayerScore(winningPlayer);
        } else if (isBoardFull(this.board)) {
            this.isGameOver = true;
            this.showDialog(`It's a draw!`);
        } else {
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.updateStatusUI(`Player ${this.currentPlayer}'s turn`);
            if (this.currentPlayer === 'O' && this.playerO === 'computer') {
                setTimeout(() => this.makeComputerMove(), 500);
            }
        }
    }

    makeComputerMove() {
        const { row, col } = randomMove(this.board);
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
        console.log("Showing dialog: ", message);
        const dialogBox = document.createElement('div');
        dialogBox.classList.add('dialog', 'show');
        dialogBox.innerHTML = `
            <p>${message}</p>
            ${buttons}
        `;
        document.querySelector('.game-top').appendChild(dialogBox);
    }
}

    const session = JSON.parse(sessionStorage.getItem('session'));
    const email = session?.email;
    if (!email) {
        window.location.href = 'index.html'; // Redirect to login if email is not found
    } else {
        window.game = new Game(email);
    }
    document.querySelector(".right-player .player-name").textContent = "Easy AI";