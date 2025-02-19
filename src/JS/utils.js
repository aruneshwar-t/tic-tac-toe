// Utility functions

export function createBoard() {
    const board = [];
    for (let i = 0; i < 3; i++) {
        board.push(new Array(3).fill(null));
    }
    return board;
}

export function checkWinner(board) {
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

export function isBoardFull(board) {
    return board.every(row => row.every(cell => cell !== null));
}

export function randomMove(board) {
    let emptyCells = [];
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (!board[row][col]) emptyCells.push([row, col]);
        }
    }
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return { row: emptyCells[randomIndex][0], col: emptyCells[randomIndex][1] };
}

// Scoring system
export class Score {
    constructor() {
        this.userScore = 0;
        this.computerScore = 0;
        this.updateScoreUI();
    }

    incrementPlayerScore(player) {
        if (player === 'user') {
            this.userScore++;
        } else if (player === 'computer') {
            this.computerScore++;
        }
        this.updateScoreUI();
    }

    updateScoreUI() {
        document.querySelector('.left-player .player-score').textContent = this.userScore;
        document.querySelector('.right-player .player-score').textContent = this.computerScore;
    }

    resetScores() {
        this.userScore = 0;
        this.computerScore = 0;
        this.updateScoreUI();
    }
}