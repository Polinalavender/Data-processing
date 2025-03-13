document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    if (email === "user@example.com" && password === "password123") {
        alert("Login Successful!");
        window.location.href = "home.html"; // Redirect to another page
    } else {
        errorMessage.textContent = "Invalid email or password.";
    }
});
