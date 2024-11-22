document.addEventListener('DOMContentLoaded', function () {
    // Handle form submission for registration
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent form from submitting the usual way

            const email = document.getElementById('registerEmail').value;
            const username = document.getElementById('registerUsername').value;
            const password = document.getElementById('registerPassword').value;

            fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, username, password }),
            })
            .then((response) => response.json())
            .then((data) => {
                if (data.userId) {
                    alert('Registration successful!');
                    $('#registerModal').modal('hide');
                } else {
                    alert('Error: ' + data.error); // Show error if registration fails
                }
            })
            .catch((err) => {
                alert('An error occurred during registration');
                console.error('Error:', err);
            });
        });
    }

    // Handle form submission for login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent the form from submitting the usual way

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })
            .then((response) => response.json())
            .then((data) => {
                if (data.userId) {
                    alert('Login successful!');
                    localStorage.setItem('username', data.username);
                    $('#loginModal').modal('hide');
                    updateNavbar(); // Update the navbar with username
                } else {
                    alert('Error: ' + data.error); // Show error if login fails
                }
            })
            .catch((err) => {
                alert('An error occurred during login');
                console.error('Error:', err);
            });
        });
    }

    // Function to update the navbar with the logged-in user's username
    function updateNavbar() {
        const username = localStorage.getItem('username');
        const loginLink = document.getElementById('loginLink');
        const usernameLink = document.getElementById('usernameLink');
        const logoutLink = document.getElementById('logoutLink');
        const usernameText = document.getElementById('usernameText');

        if (username) {
            loginLink.style.display = 'none';
            usernameLink.style.display = 'block';
            logoutLink.style.display = 'block';
            usernameText.textContent = username;
        } else {
            loginLink.style.display = 'block';
            usernameLink.style.display = 'none';
            logoutLink.style.display = 'none';
        }
    }

    // Update navbar based on user login status
    updateNavbar();

    // Logout logic
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            localStorage.removeItem('username');
            updateNavbar();
        });
    }
});
