/**
 * Admin Login Page - Form Validation
 * Antigravity Coding Assistant
 */

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("adminLoginForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault(); // Prevent standard submission

            const username = usernameInput.value.trim();
            const password = passwordInput.value;

            if (username === "fido" && password === "fido") {
                // Set the session flag so the workspace doesn't re-prompt
                sessionStorage.setItem("admin_logged_in", "true");
                alert("Login successful! Welcome, Fido.");
                window.location.href = "admin_workspace.html";
            } else {
                alert("Invalid Admin Username or Password! Access Denied.");
            }
        });
    }
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
});
