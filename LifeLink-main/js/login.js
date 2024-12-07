document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('donorLoginForm');
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');

    // Toggle password visibility
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });

    // Handle form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Remove any existing error messages
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());

        // Get form data
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.querySelector('input[name="remember"]').checked;

        // Basic validation
        let isValid = true;

        if (!email) {
            showError('email', 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }

        if (!password) {
            showError('password', 'Password is required');
            isValid = false;
        }

        if (isValid) {
            try {
                // Show loading state
                const submitButton = loginForm.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                submitButton.disabled = true;
                submitButton.textContent = 'Logging in...';

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));

                // For demo purposes, show success and redirect
                // In a real application, you would validate credentials with your backend
                alert('Login successful!');
                window.location.href = '/donor-dashboard.html'; // Redirect to dashboard

            } catch (error) {
                showError('email', 'Invalid email or password');
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        }
    });

    // Helper function to show error messages
    function showError(inputId, message) {
        const input = document.getElementById(inputId);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        input.parentElement.classList.add('error');
        input.parentElement.parentElement.appendChild(errorDiv);
    }

    // Helper function to validate email format
    function isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }
});
