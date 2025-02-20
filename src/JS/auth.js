document.addEventListener('DOMContentLoaded', function() {
    // Check if the user is logged in
    const session = sessionStorage.getItem('session');
    if (!session) {
        // Redirect to login page if not logged in
        window.location.href = 'index.html';
    }
});