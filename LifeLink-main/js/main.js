// Testimonial Slider
document.addEventListener('DOMContentLoaded', function() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;

    function showSlide(index) {
        testimonials.forEach(testimonial => testimonial.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
    }

    // Auto slide every 5 seconds
    setInterval(() => {
        currentSlide = (currentSlide + 1) % testimonials.length;
        showSlide(currentSlide);
    }, 5000);

    // Click handlers for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        if (scrollTop === 0) {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        }
        
        lastScrollTop = scrollTop;
    });

    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Animation on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature-card, .stat-item, .testimonial-card');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Initial animation check
    animateOnScroll();
    
    // Animation on scroll event
    window.addEventListener('scroll', animateOnScroll);

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }

    // Admin Login Form Handler
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Here you would typically make an API call to verify credentials
            // For now, we'll just show an alert
            alert('Login functionality will be implemented with backend integration');
        });
    }

    // Form Initialization
    initializeMultiStepForm('donorRegistrationForm');
    initializeMultiStepForm('recipientRegistrationForm');
    
    // Initialize accordions
    initializeAccordions();
});

// Multi-step form initialization
function initializeMultiStepForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    const steps = Array.from(form.querySelectorAll('.form-step'));
    const progressBar = form.closest('.registration-form').querySelector('.progress-bar');
    const nextBtn = form.querySelector('.btn-next');
    const prevBtn = form.querySelector('.btn-prev');
    const submitBtn = form.querySelector('.btn-submit');
    let currentStep = 1;

    // Show specific step
    function showStep(step) {
        // Update form steps
        steps.forEach(s => s.classList.remove('active'));
        steps[step - 1].classList.add('active');
        
        // Update progress bar
        progressBar.setAttribute('data-step', step);
        const progressSteps = progressBar.querySelectorAll('.step');
        progressSteps.forEach((s, index) => {
            if (index + 1 === step) {
                s.classList.add('active');
                s.classList.remove('completed');
            } else if (index + 1 < step) {
                s.classList.remove('active');
                s.classList.add('completed');
            } else {
                s.classList.remove('active', 'completed');
            }
        });
        
        // Update buttons
        if (step === 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'inline-block';
            submitBtn.style.display = 'none';
        } else if (step === steps.length) {
            prevBtn.style.display = 'inline-block';
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'inline-block';
        } else {
            prevBtn.style.display = 'inline-block';
            nextBtn.style.display = 'inline-block';
            submitBtn.style.display = 'none';
        }
    }

    // Validate current step
    function validateStep(step) {
        const currentStepEl = steps[step - 1];
        const requiredInputs = currentStepEl.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        requiredInputs.forEach(input => {
            if (input.type === 'checkbox') {
                if (!input.checked) {
                    isValid = false;
                    input.closest('.form-group').classList.add('error');
                }
            } else if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
            }
        });

        if (!isValid) {
            alert('Please fill in all required fields before proceeding.');
        }

        return isValid;
    }

    // Next button click handler
    nextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (validateStep(currentStep) && currentStep < steps.length) {
            currentStep++;
            showStep(currentStep);
        }
    });

    // Previous button click handler
    prevBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateStep(steps.length)) {
            // Here you would typically send the form data to your backend
            alert('Registration submitted successfully! We will contact you soon.');
            form.reset();
            currentStep = 1;
            showStep(1);
        }
    });

    // Remove error class on input
    form.addEventListener('input', function(e) {
        if (e.target.classList.contains('error')) {
            e.target.classList.remove('error');
        }
    });

    // Initialize form
    showStep(1);
}

// Accordion functionality
function initializeAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            const isActive = accordionItem.classList.contains('active');
            
            // Close all accordion items
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                accordionItem.classList.add('active');
            }
        });
    });
}

// Page Loader
window.addEventListener('load', function() {
    const loader = document.querySelector('.page-loader');
    setTimeout(() => {
        loader.classList.add('fade-out');
    }, 2000); // 2 seconds delay
});
