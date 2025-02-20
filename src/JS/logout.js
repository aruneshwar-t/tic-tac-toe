document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('logout-button');

    logoutButton.addEventListener('click', function() {
        // Clear session
        sessionStorage.removeItem('session');
        // Redirect to login page
        window.location.href = 'index.html';
    });
});