/**
 * Patient Registration - Interactive Validation & Persistence
 * Antigravity Coding Assistant
 */

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    const fullNameInput = document.getElementById("reg_fullname");
    const usernameInput = document.getElementById("reg_username");
    const passwordInput = document.getElementById("reg_password");
    const confirmPasswordInput = document.getElementById("reg_confirm_password");

    // Toggle Password Visibility
    const togglePasswordBtn = document.querySelector(".toggle-password");
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener("click", () => {
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                togglePasswordBtn.textContent = "Hide";
            } else {
                passwordInput.type = "password";
                togglePasswordBtn.textContent = "Show";
            }
        });
    }

    // Toggle Confirm Password Visibility
    const toggleConfirmBtn = document.querySelector(".toggle-password-confirm");
    if (toggleConfirmBtn && confirmPasswordInput) {
        toggleConfirmBtn.addEventListener("click", () => {
            if (confirmPasswordInput.type === "password") {
                confirmPasswordInput.type = "text";
                toggleConfirmBtn.textContent = "Hide";
            } else {
                confirmPasswordInput.type = "password";
                toggleConfirmBtn.textContent = "Show";
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const fullName = fullNameInput.value.trim();
            const username = usernameInput.value.trim().toLowerCase();
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            // Simple validation
            if (password !== confirmPassword) {
                alert("Passwords do not match! Please verify your inputs.");
                return;
            }

            if (password.length < 4) {
                alert("Password is too short! Use at least 4 characters.");
                return;
            }

            // Retrieve existing users database
            let users = JSON.parse(localStorage.getItem("registered_users")) || {};

            if (users[username]) {
                alert("This email or username is already registered! Please use another one or Log In.");
                return;
            }

            // Add new user
            users[username] = {
                fullName: fullName,
                password: password
            };

            // Save updated database to localStorage
            localStorage.setItem("registered_users", JSON.stringify(users));

            alert(`Registration successful! Welcome to the portal, ${fullName}.`);
            
            // Auto redirect to login
            window.location.href = "login.html";
        });
    }
});
