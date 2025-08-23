// ====================================
// ELTica - JavaScript Logic
// ====================================

// Initialize EmailJS when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    emailjs.init("bHdkxO1fKi4fGUndp");
    
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Initialize Tailwind config
    if (typeof tailwind !== 'undefined') {
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#7950F2',
                        'primary-dark': '#6841E0',
                        'primary-light': '#9B7EF5',
                        accent: '#4ECDC4',
                        'accent-light': '#7FDBDA',
                    }
                }
            }
        };
    }
    
    // Initialize Google Analytics
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-VLQHNS2HS3');
    
    // Initialize all components
    initCountdown();
    initAnimations();
    initMobileMenu();
    initContactForm();
    initSmoothScroll();
});

// ====================================
// Countdown Timer
// ====================================
function initCountdown() {
    function updateCountdown() {
        const launchDate = new Date('September 13, 2025 15:30:00 GMT').getTime();
        const now = new Date().getTime();
        const distance = launchDate - now;

        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            const daysEl = document.getElementById('days');
            const hoursEl = document.getElementById('hours');
            const minutesEl = document.getElementById('minutes');
            const secondsEl = document.getElementById('seconds');

            if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
            if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
            if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
            if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
        } else {
            // Launch has happened
            const countdownEl = document.getElementById('countdown');
            if (countdownEl) {
                countdownEl.innerHTML = '<div class="text-2xl font-bold gradient-text">The Future Has Arrived!</div>';
            }
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ====================================
// Intersection Observer for Animations
// ====================================
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Stop observing after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animated sections
    const animatedSections = document.querySelectorAll('.animated-section');
    animatedSections.forEach(section => {
        observer.observe(section);
    });

    // Add staggered animations for feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// ====================================
// Mobile Menu Management
// ====================================
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    
    if (!mobileMenuBtn || !mobileMenu) return;

    let isMenuOpen = false;

    function toggleMenu(open) {
        isMenuOpen = open;
        
        if (open) {
            mobileMenu.classList.add('is-open');
            document.body.style.overflow = 'hidden';
            updateMenuIcon('x');
        } else {
            mobileMenu.classList.remove('is-open');
            document.body.style.overflow = 'auto';
            updateMenuIcon('menu');
        }
    }

    function updateMenuIcon(iconName) {
        const menuIcon = mobileMenuBtn.querySelector('i');
        if (menuIcon) {
            menuIcon.setAttribute('data-lucide', iconName);
            lucide.createIcons();
        }
    }

    // Toggle button click
    mobileMenuBtn.addEventListener('click', () => {
        toggleMenu(!isMenuOpen);
    });

    // Close button click
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', () => {
            toggleMenu(false);
        });
    }

    // Close menu when clicking on links
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu(false);
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            toggleMenu(false);
        }
    });

    // Close menu when clicking outside (optional)
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            toggleMenu(false);
        }
    });
}

// ====================================
// Contact Form with EmailJS
// ====================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const successModal = document.getElementById('successModal');
    const closeModal = document.getElementById('closeModal');

    if (!contactForm || !successModal) return;

    // Form validation
    function validateForm() {
        const formData = new FormData(contactForm);
        const errors = [];

        // Check required fields
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        if (!name || name.trim().length < 2) {
            errors.push('Please enter a valid name');
        }

        if (!email || !isValidEmail(email)) {
            errors.push('Please enter a valid email address');
        }

        if (!message || message.trim().length < 10) {
            errors.push('Please enter a message (at least 10 characters)');
        }

        return errors;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Form submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate form
        const errors = validateForm();
        if (errors.length > 0) {
            alert(errors.join('\n'));
            return;
        }

        // Get form data
        const formData = new FormData(contactForm);
        const templateParams = {
            from_name: formData.get('name'),
            from_email: formData.get('email'),
            organization: formData.get('organization') || 'Not specified',
            message: formData.get('message'),
            to_name: 'ELTica Team',
        };

        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        try {
            // Send email using EmailJS
            const response = await emailjs.send('service_bgxu7d1', 'template_hpg0i4p', templateParams);
            
            console.log('Email sent successfully!', response.status, response.text);
            
            // Show success modal
            showModal(successModal);
            
            // Reset form
            contactForm.reset();
            
            // Reset form validation states
            const formInputs = contactForm.querySelectorAll('.form-input');
            formInputs.forEach(input => {
                input.classList.remove('error', 'success');
                input.style.borderColor = '';
            });
            
            // Re-initialize Lucide icons if needed
            setTimeout(() => {
                lucide.createIcons();
            }, 100);
            
        } catch (error) {
            console.error('Failed to send email:', error);
            alert('Sorry, there was an error sending your message. Please try again later or contact us directly.');
        } finally {
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });

    // Close modal button
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            hideModal(successModal);
        });
    }

    // Close modal when clicking outside
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            hideModal(successModal);
        }
    });

    // Form input validation visual feedback
    const formInputs = contactForm.querySelectorAll('.form-input');
    
    formInputs.forEach(input => {
        // On blur validation
        input.addEventListener('blur', () => {
            validateInput(input);
        });
        
        // On focus styling
        input.addEventListener('focus', () => {
            input.style.borderColor = '#7950F2';
            input.classList.remove('error', 'success');
        });
        
        // Real-time validation for email
        if (input.type === 'email') {
            input.addEventListener('input', () => {
                if (input.value && isValidEmail(input.value)) {
                    input.classList.remove('error');
                    input.classList.add('success');
                }
            });
        }
    });

    function validateInput(input) {
        if (input.hasAttribute('required') && !input.value.trim()) {
            input.classList.add('error');
            input.classList.remove('success');
            input.style.borderColor = '#ef4444';
        } else if (input.type === 'email' && input.value && !isValidEmail(input.value)) {
            input.classList.add('error');
            input.classList.remove('success');
            input.style.borderColor = '#ef4444';
        } else if (input.value.trim()) {
            input.classList.remove('error');
            input.classList.add('success');
            input.style.borderColor = '#10b981';
        } else {
            input.classList.remove('error', 'success');
            input.style.borderColor = '';
        }
    }
}

// ====================================
// Modal Management
// ====================================
function showModal(modal) {
    if (!modal) return;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
}

function hideModal(modal) {
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.style.overflow = 'auto';
}

// ====================================
// Smooth Scroll for Navigation Links
// ====================================
function initSmoothScroll() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Skip if just "#" or empty
            if (href === '#' || !href) return;
            
            const targetElement = document.querySelector(href);
            if (!targetElement) return;
            
            e.preventDefault();
            
            // Calculate offset for sticky header
            const header = document.querySelector('header');
            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            // Smooth scroll to target
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Update URL without jumping
            history.pushState(null, null, href);
            
            // Close mobile menu if open
            const mobileMenu = document.querySelector('.mobile-menu');
            if (mobileMenu && mobileMenu.classList.contains('is-open')) {
                mobileMenu.classList.remove('is-open');
                document.body.style.overflow = 'auto';
                
                // Update menu icon
                const mobileMenuBtn = document.getElementById('mobileMenuBtn');
                if (mobileMenuBtn) {
                    const menuIcon = mobileMenuBtn.querySelector('i');
                    if (menuIcon) {
                        menuIcon.setAttribute('data-lucide', 'menu');
                        lucide.createIcons();
                    }
                }
            }
        });
    });
}

// ====================================
// Utility Functions
// ====================================

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for performance optimization
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ====================================
// Header Scroll Effects
// ====================================
function initHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;
    
    let lastScroll = 0;
    
    const handleScroll = throttle(() => {
        const currentScroll = window.pageYOffset;
        
        // Add shadow on scroll
        if (currentScroll > 10) {
            header.classList.add('shadow-lg');
        } else {
            header.classList.remove('shadow-lg');
        }
        
        // Hide/show header on scroll (optional)
        // if (currentScroll > lastScroll && currentScroll > 100) {
        //     header.style.transform = 'translateY(-100%)';
        // } else {
        //     header.style.transform = 'translateY(0)';
        // }
        
        lastScroll = currentScroll;
    }, 100);
    
    window.addEventListener('scroll', handleScroll);
}

// Initialize header scroll effects
document.addEventListener('DOMContentLoaded', initHeaderScroll);

// ====================================
// Performance Optimizations
// ====================================

// Lazy load images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// Initialize lazy loading if needed
document.addEventListener('DOMContentLoaded', initLazyLoading);

// ====================================
// Accessibility Improvements
// ====================================

// Handle keyboard navigation for mobile menu
function initKeyboardAccessibility() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (!mobileMenuBtn || !mobileMenu) return;
    
    // Trap focus in mobile menu when open
    mobileMenu.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            const focusableElements = mobileMenu.querySelectorAll(
                'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
            );
            
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });
}

// Initialize keyboard accessibility
document.addEventListener('DOMContentLoaded', initKeyboardAccessibility);

// ====================================
// Error Handling
// ====================================

// Global error handler
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // You can send error logs to a service here
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // You can send error logs to a service here
});

// ====================================
// Page Load Performance Tracking
// ====================================
window.addEventListener('load', () => {
    // Log page load performance
    if ('performance' in window) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page load time: ${pageLoadTime}ms`);
        
        // Send to analytics if needed
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_load_time', {
                value: pageLoadTime,
                event_category: 'performance'
            });
        }
    }
});