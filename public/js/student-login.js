document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference or default to light
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply the saved theme on page load
    if (currentTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
    } else {
        body.removeAttribute('data-theme');
        themeToggle.textContent = '🌙';
    }
    
    // Theme toggle click event
    themeToggle.addEventListener('click', () => {
        if (body.getAttribute('data-theme') === 'dark') {
            body.removeAttribute('data-theme');
            themeToggle.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        } else {
            body.setAttribute('data-theme', 'dark');
            themeToggle.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        }
    });
    
    // Password visibility toggle
    const togglePassword = document.getElementById('toggle-password');
    const passwordField = document.getElementById('password');
    
    togglePassword.addEventListener('click', () => {
        if (passwordField.type === 'password') {
            passwordField.type = 'text';
            togglePassword.textContent = '👁️‍🗨️';
        } else {
            passwordField.type = 'password';
            togglePassword.textContent = '👁️';
        }
    });
    
    // Form submission
    const loginForm = document.getElementById('login-form');
    const statusMessage = document.getElementById('status-message');
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Show loading state
        const loginBtn = document.querySelector('.login-btn');
        const originalBtnText = loginBtn.textContent;
        loginBtn.textContent = 'Signing in...';
        loginBtn.disabled = true;
        
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Success message
                statusMessage.textContent = 'Login successful! Redirecting...';
                statusMessage.className = 'success';
                statusMessage.style.display = 'block';
                
                // Redirect to dashboard after successful login
                // Redirect to teacherDash.html after successful login
                setTimeout(() => {
                    window.location.href = '../pages/studentDash.html';
                }, 1500);

            } else {
                // Error message
                statusMessage.textContent = data.message || 'Login failed. Please check your credentials.';
                statusMessage.className = 'error';
                statusMessage.style.display = 'block';
                
                // Reset button
                loginBtn.textContent = originalBtnText;
                loginBtn.disabled = false;
                
                // Hide message after 3 seconds
                setTimeout(() => {
                    statusMessage.style.display = 'none';
                }, 3000);
            }
        } catch (error) {
            console.error('Error:', error);
            
            // Network error message
            statusMessage.textContent = 'Connection error. Please try again later.';
            statusMessage.className = 'error';
            statusMessage.style.display = 'block';
            
            // Reset button
            loginBtn.textContent = originalBtnText;
            loginBtn.disabled = false;
            
            // Hide message after 3 seconds
            setTimeout(() => {
                statusMessage.style.display = 'none';
            }, 3000);
        }
    });
    
    // Social login handlers
    document.getElementById('google-login').addEventListener('click', () => {
        window.location.href = '/api/auth/google';
    });
    
    document.getElementById('github-login').addEventListener('click', () => {
        window.location.href = '/api/auth/github';
    });
    
    document.getElementById('facebook-login').addEventListener('click', () => {
        window.location.href = '/api/auth/facebook';
    });
});