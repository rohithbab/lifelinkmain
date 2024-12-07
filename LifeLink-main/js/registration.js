document.addEventListener('DOMContentLoaded', function() {
    // Handle both donor and recipient forms
    const donorForm = document.getElementById('donorRegistrationForm');
    const recipientForm = document.getElementById('recipientRegistrationForm');
    const form = donorForm || recipientForm;

    if (!form) return; // Exit if no form is found

    const steps = Array.from(document.querySelectorAll('.form-step'));
    const progressSteps = Array.from(document.querySelectorAll('.progress-bar .step'));
    const nextBtn = document.querySelector('.btn-next');
    const prevBtn = document.querySelector('.btn-prev');
    const submitBtn = document.querySelector('.btn-submit');
    let currentStep = 0;

    // Initialize accordion functionality
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            accordionItems.forEach(i => i.classList.remove('active'));
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Form navigation
    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
            progressSteps[index].classList.toggle('active', index <= stepIndex);
        });

        // Update navigation buttons
        prevBtn.style.display = stepIndex === 0 ? 'none' : 'block';
        
        if (stepIndex === steps.length - 1) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }
    }

    // Validate current step
    function validateStep(stepIndex) {
        const currentStepElement = steps[stepIndex];
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            // Remove existing error messages
            const existingError = field.parentElement.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            field.parentElement.classList.remove('error');

            if (!field.value.trim()) {
                isValid = false;
                field.parentElement.classList.add('error');
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = 'This field is required';
                field.parentElement.appendChild(errorMessage);
            }
        });

        // Validate organ selection on step 3
        if (stepIndex === 2) {
            const organCheckboxes = currentStepElement.querySelectorAll('input[name="organs"]');
            const selectedOrgans = Array.from(organCheckboxes).filter(cb => cb.checked);
            
            if (selectedOrgans.length === 0) {
                isValid = false;
                const organGroup = currentStepElement.querySelector('.organs');
                organGroup.classList.add('error');
                
                // Remove existing error message if any
                const existingError = organGroup.querySelector('.error-message');
                if (existingError) {
                    existingError.remove();
                }
                
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = 'Please select at least one organ';
                organGroup.appendChild(errorMessage);
            }
        }

        // Email validation
        const emailField = currentStepElement.querySelector('input[type="email"]');
        if (emailField && emailField.value.trim()) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailField.value)) {
                isValid = false;
                emailField.parentElement.classList.add('error');
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = 'Please enter a valid email address';
                emailField.parentElement.appendChild(errorMessage);
            }
        }

        // Phone validation
        const phoneFields = currentStepElement.querySelectorAll('input[type="tel"]');
        phoneFields.forEach(field => {
            if (field.value.trim()) {
                const phonePattern = /^\d{10}$/;
                if (!phonePattern.test(field.value.replace(/\D/g, ''))) {
                    isValid = false;
                    field.parentElement.classList.add('error');
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'error-message';
                    errorMessage.textContent = 'Please enter a valid 10-digit phone number';
                    field.parentElement.appendChild(errorMessage);
                }
            }
        });

        return isValid;
    }

    // Handle next button click
    nextBtn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            currentStep++;
            showStep(currentStep);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    // Handle previous button click
    prevBtn.addEventListener('click', () => {
        currentStep--;
        showStep(currentStep);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateStep(currentStep)) {
            return;
        }

        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Add selected organs to data
        const selectedOrgans = Array.from(form.querySelectorAll('input[name="organs"]:checked'))
            .map(checkbox => checkbox.value);
        data.organs = selectedOrgans;

        // Add medical conditions to data
        const selectedConditions = Array.from(form.querySelectorAll('input[name="conditions"]:checked'))
            .map(checkbox => checkbox.value);
        data.conditions = selectedConditions;

        try {
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Show success message
            alert('Registration submitted successfully! We will contact you soon.');
            
            // Reset form
            form.reset();
            currentStep = 0;
            showStep(currentStep);
            
        } catch (error) {
            alert('An error occurred. Please try again later.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Registration';
        }
    });

    // Format phone numbers as they are typed
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value.length <= 3) {
                    value = value;
                } else if (value.length <= 6) {
                    value = value.slice(0, 3) + '-' + value.slice(3);
                } else {
                    value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6, 10);
                }
            }
            e.target.value = value;
        });
    });

    // Initialize the form
    showStep(currentStep);
});
