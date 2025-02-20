document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Validate email and password
        if (validateEmail(email) && validatePassword(email, password)) {
            // Perform login and create session
            login(email);
        } else {
            alert('Invalid email or password.');
        }
    });

    function validateEmail(email) {
        // Simple email validation
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePassword(email, password) {
        // Check if the password matches the one stored for the given email
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.email === email);
        return user && user.password === password;
    }

    function login(email) {
        // Create session
        sessionStorage.setItem('session', JSON.stringify({ email: email }));
        alert('Login successful!');
        // Redirect to game menu page after login
        window.location.href = 'game-menu.html';
    }
});