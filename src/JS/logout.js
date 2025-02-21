document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('logout-button');

    logoutButton.addEventListener('click', function() {
        // Show confirmation dialog
        if (confirm('Are you sure you want to log out?')) {
            // Clear session storage
            const session = JSON.parse(sessionStorage.getItem('session'));
            const email = session?.email;

            // Reset scores in local storage
            if (email) {
                const savedScores = JSON.parse(localStorage.getItem('scores')) || {};
                if (savedScores[email]) {
                    savedScores[email] = {
                        easy: { userScore: 0, computerScore: 0 },
                        medium: { userScore: 0, computerScore: 0 },
                        impossible: { userScore: 0, computerScore: 0 }
                    };
                    localStorage.setItem('scores', JSON.stringify(savedScores));
                }

                // Reset manual scores in session storage
                const manualScores = JSON.parse(sessionStorage.getItem('manualScores')) || {};
                if (manualScores[email]) {
                    manualScores[email] = { userScore: 0, opponentScore: 0 };
                    sessionStorage.setItem('manualScores', JSON.stringify(manualScores));
                }
            }

            // Clear session storage
            sessionStorage.clear();

            // Redirect to login page
            window.location.href = 'index.html';
        }
    });
});