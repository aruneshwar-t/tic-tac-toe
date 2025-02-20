document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const name = document.getElementById('name').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Validate email, name, and password
        if (validateEmail(email) && validateName(name) && validatePassword(password, name, email) && validateConfirmPassword(password, confirmPassword)) {
            // Perform registration and create session
            register(email, name, password);
        } else {
            alert('Invalid input.');
        }
    });

    function validateEmail(email) {
        // Simple email validation
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validateName(name) {
        // Simple name validation
        return name.trim().length > 0;
    }

    function validatePassword(password, name, email) {
        // Password validation: at least 8 chars, alphanumeric, no part of name or email
        const re = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d_]{8,}$/;
        if (!re.test(password)) return false;
        if (password.includes(name) || password.includes(email)) return false;
        return true;
    }

    function validateConfirmPassword(password, confirmPassword) {
        // Confirm password validation
        return password === confirmPassword;
    }

    function register(email, name, password) {
        // Get existing users from local storage
        let users = JSON.parse(localStorage.getItem('users')) || [];

        // Check if the email is already registered
        if (users.some(user => user.email === email)) {
            alert('This email is already registered.');
            return;
        }

        // Add new user to the list
        users.push({ email: email, name: name, password: password });

        // Save updated users list to local storage
        localStorage.setItem('users', JSON.stringify(users));

        alert('Registration successful!');

        // Create session
        sessionStorage.setItem('session', JSON.stringify({ email: email }));
        
        // Redirect to game menu page after registration
        window.location.href = 'game-menu.html';
    }
});