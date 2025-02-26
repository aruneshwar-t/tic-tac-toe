document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (validateEmail(email) && validatePassword(email, password)) {
            const name = getUserByEmail(email).name;
            login(email, name);
        } else {
            showAlert('Invalid email or password.');
        }
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePassword(email, password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.email === email);
        return user && user.password === password;
    }

    function getUserByEmail(email) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        return users.find(user => user.email === email);
    }

    function login(email, name) {
        sessionStorage.setItem('session', JSON.stringify({ email: email, name: name }));
        showAlert('Login successful!', function() {
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