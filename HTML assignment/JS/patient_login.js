/**
 * Patient Login - Interactivity & Database Validation
 * Antigravity Coding Assistant
 */

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("patientLoginForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = usernameInput.value.trim().toLowerCase();
            const password = passwordInput.value;

            // Fetch users database from localStorage
            const users = JSON.parse(localStorage.getItem("registered_users")) || {};

            // Check if user exists and password is correct
            if (users[username] && users[username].password === password) {
                const fullName = users[username].fullName;
                alert(`Welcome back, ${fullName}! Redirecting to appointment scheduler.`);
                
                // Set session storage
                sessionStorage.setItem("patient_name", fullName);
                sessionStorage.setItem("patient_logged_in", "true");
                
                // Navigate to patient info page
                window.location.href = "patient_info.html";
            } else {
                alert("Access Denied: Invalid Email/Username or Password!\n\nIf you don't have an account, please click 'Register Now' to sign up.");
            }
        });
    }

    // Toggle Password Visibility
    const passwordInputEl = document.getElementById("password");
    const togglePasswordBtn = document.querySelector(".toggle-password");
    if (togglePasswordBtn && passwordInputEl) {
        togglePasswordBtn.addEventListener("click", () => {
            if (passwordInputEl.type === "password") {
                passwordInputEl.type = "text";
                togglePasswordBtn.textContent = "Hide";
            } else {
                passwordInputEl.type = "password";
                togglePasswordBtn.textContent = "Show";
            }
        });
    }
});
