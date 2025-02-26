document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const name = document.getElementById('name').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        let isValid = true;

        if (!validateEmail(email)) {
            showAlert('Invalid email format.');
            isValid = false;
        }

        if (!validateName(name)) {
            showAlert('Name cannot be empty.');
            isValid = false;
        }

        if (!validatePassword(password, name, email)) {
            showAlert('Password must be at least 8 characters long, contain both letters and numbers, and should not include your name or email.');
            isValid = false;
        }

        if (!validateConfirmPassword(password, confirmPassword)) {
            showAlert('Passwords do not match.');
            isValid = false;
        }

        if (isValid) {
            register(email, name, password);
        }
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validateName(name) {
        return name.trim().length > 0;
    }

    function validatePassword(password, name, email) {
        const re = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d_]{8,}$/;
        if (!re.test(password)) return false;
        if (password.includes(name) || password.includes(email)) return false;
        return true;
    }

    function validateConfirmPassword(password, confirmPassword) {
        return password === confirmPassword;
    }

    function register(email, name, password) {
        let users = JSON.parse(localStorage.getItem('users')) || [];

        if (users.some(user => user.email === email)) {
            showAlert('This email is already registered.');
            return;
        }

        users.push({ email: email, name: name, password: password });
        localStorage.setItem('users', JSON.stringify(users));

        showAlert('Registration successful!', function() {
            sessionStorage.setItem('session', JSON.stringify({ email: email, name: name }));
            window.location.href = 'game-menu.html';
        });
    }

    function showAlert(message, callback) {
        const alertBox = document.getElementById('customAlert');
        const alertMessage = document.getElementById('alertMessage');
        alertMessage.textContent = message;
        alertBox.style.display = 'block';

        alertBox.querySelector('button').onclick = function() {
            alertBox.style.display = 'none';
            if (callback) callback();
        };
    }

    window.closeAlert = function() {
        document.getElementById('customAlert').style.display = 'none';
    };
});