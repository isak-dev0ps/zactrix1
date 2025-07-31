// Main JavaScript file for Zactrix Digital Agency

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initPreloader();
    initSmoothScrolling();
    initNavbarToggle();
    initFormHandlers();
    initScrollAnimations();
    initFloatingContact();
});

function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    preloader.style.transition = 'opacity 0.5s ease';

    const helloTexts = document.querySelectorAll('.hello-text');
    const languages = ['ta','ms','de','ar','no','hi','fr','ja','zh'];
    let currentIndex = 0;

    // Prepare all hello texts
    helloTexts.forEach(text => {
        text.style.opacity = '0';
        text.style.animation = 'none';
    });

    function showNextHello() {
        // Hide all first (in case some linger)
        helloTexts.forEach(text => {
            text.style.opacity = '0';
            text.style.animation = 'none';
        });

        if (currentIndex < languages.length) {
            const currentText = document.querySelector(`[data-lang="${languages[currentIndex]}"]`);
            if (currentText) {
                // Force reflow to restart animation
                void currentText.offsetWidth;
                currentText.style.opacity = '1';
                currentText.style.animation = 'fadeInOut 0.8s ease-in-out';
            }

            currentIndex++;

            setTimeout(showNextHello, 850); // slight delay to complete animation
        } else {
            // Fade out preloader
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }, 500);
            }, 800);
        }
    }

    // Start animation
    document.body.style.overflow = 'hidden';
    setTimeout(showNextHello, 500);
}



document.addEventListener("DOMContentLoaded", () => {
    const card = document.querySelector('.floating-card');
    if (!card) return;

    let angle = 0;
    const radius = 15; // Max float distance in px
    const speed = 0.02; // Speed of float — lower = slower, smoother

    function smoothFloat() {
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        card.style.transform = `translate(${x}px, ${y}px)`;
        angle += speed;
        requestAnimationFrame(smoothFloat);
    }

    smoothFloat();
});





// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
            }
        });
    });
}

// Navbar scroll effect
function initNavbarToggle() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// Form handlers
function initFormHandlers() {
    // Main contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    // Modal contact form
    const modalContactForm = document.getElementById('modalContactForm');
    if (modalContactForm) {
        modalContactForm.addEventListener('submit', handleModalContactSubmit);
    }
    
    // Enquiry form
    const enquiryForm = document.getElementById('enquiryForm');
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', handleEnquirySubmit);
    }
}

// Handle main contact form submission
async function handleContactSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/submit_contact', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert('success', result.message);
            form.reset();
            
            // Ask if user wants to continue on WhatsApp
            if (confirm('Thank you for your submission! Would you like to continue the conversation on WhatsApp?')) {
                window.open(result.whatsapp_url, '_blank');
            }
        } else {
            showAlert('error', result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('error', 'There was an error submitting your form. Please try again. Or try on Whatsapp FOR Flaw less work flow and faster response ');
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Handle modal contact form submission
async function handleModalContactSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/submit_contact', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert('success', result.message);
            form.reset();
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('contactModal'));
            if (modal) {
                modal.hide();
            }
            
            // Ask if user wants to continue on WhatsApp
            if (confirm('Thank you for your submission! Would you like to continue the conversation on WhatsApp?')) {
                window.open(result.whatsapp_url, '_blank');
            }
        } else {
            showAlert('error', result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('error', 'There was an error submitting your form. Please try again.');
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Handle enquiry form submission
async function handleEnquirySubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/submit_enquiry', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert('success', result.message);
            form.reset();
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('enquiryModal'));
            if (modal) {
                modal.hide();
            }
        } else {
            showAlert('error', result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('error', 'There was an error submitting your enquiry. Please try again.');
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Send to WhatsApp functionality
function sendToWhatsApp() {
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);
    
    const name = formData.get('name');
    const whatsapp = formData.get('whatsapp');
    const services = formData.get('services');
    const budget = formData.get('budget');
    const requirements = formData.get('requirements');
    
    if (!name || !whatsapp || !services || !budget || !requirements) {
        showAlert('error', 'Please fill in all required fields before sending to WhatsApp.');
        return;
    }
    
    const message = `Hi Zactrix! I'm ${name}, interested in ${services}. My budget is $${budget}. ${requirements}`;
    const whatsappUrl = `https://wa.me/+917845603453?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
}

// Open enquiry modal
function openEnquiryModal(serviceName) {
    const modal = new bootstrap.Modal(document.getElementById('enquiryModal'));
    const serviceInput = document.getElementById('enquiryService');
    const modalTitle = document.querySelector('#enquiryModal .modal-title');
    
    serviceInput.value = serviceName;
    modalTitle.textContent = `Enquiry for ${serviceName}`;
    
    modal.show();
}

// Open contact modal
function openContactModal() {
    const modal = new bootstrap.Modal(document.getElementById('contactModal'));
    modal.show();
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Add fade-in animation to sections
    const sections = document.querySelectorAll('.service-card, .portfolio-item, .testimonial-card, .value-card');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.6s ease';
        observer.observe(section);
    });
}

// Floating contact button
function initFloatingContact() {
    const floatingBtn = document.querySelector('.floating-btn');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            floatingBtn.style.display = 'flex';
        } else {
            floatingBtn.style.display = 'none';
        }
    });
}

// Alert system
function showAlert(type, message) {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.custom-alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create new alert
    const alert = document.createElement('div');
    alert.className = `alert alert-${type === 'success' ? 'success' : 'danger'} custom-alert`;
    alert.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    alert.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2"></i>
            <span>${message}</span>
            <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;
    
    document.body.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert && alert.parentElement) {
            alert.remove();
        }
    }, 5000);
}

// Add CSS for alert animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .custom-alert {
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        border: none;
        padding: 1rem;
    }
`;
document.head.appendChild(style);

// Performance optimization
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

// Optimize scroll events
window.addEventListener('scroll', debounce(function() {
    // Scroll-dependent functions here
}, 10));

// Lazy loading for images (if implemented later)
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Error handling for failed resources
window.addEventListener('error', function(e) {
    console.error('Resource failed to load:', e.target.src || e.target.href);
}, true);

// Service Worker registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Analytics and tracking (placeholder)
function trackEvent(eventName, eventData) {
    // Google Analytics or other tracking service integration
    console.log('Event tracked:', eventName, eventData);
}

// Form validation helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone);
}

// Add real-time validation to forms
document.addEventListener('input', function(e) {
    if (e.target.type === 'email') {
        const isValid = validateEmail(e.target.value);
        e.target.classList.toggle('is-invalid', !isValid && e.target.value);
        e.target.classList.toggle('is-valid', isValid && e.target.value);
    }
    
    if (e.target.type === 'tel') {
        const isValid = validatePhone(e.target.value);
        e.target.classList.toggle('is-invalid', !isValid && e.target.value);
        e.target.classList.toggle('is-valid', isValid && e.target.value);
    }
});

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    // Enable keyboard navigation for custom elements
    if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.classList.contains('service-card') || e.target.classList.contains('portfolio-item')) {
            e.target.click();
        }
    }
});

// Dark mode toggle (optional feature)
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Initialize dark mode from localStorage
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

// Print optimization
window.addEventListener('beforeprint', function() {
    // Hide unnecessary elements for printing
    const elementsToHide = document.querySelectorAll('.floating-contact, .navbar, .modal');
    elementsToHide.forEach(el => el.style.display = 'none');
});

window.addEventListener('afterprint', function() {
    // Restore hidden elements after printing
    const elementsToShow = document.querySelectorAll('.floating-contact, .navbar, .modal');
    elementsToShow.forEach(el => el.style.display = '');
});

// Network status handling
window.addEventListener('online', function() {
    showAlert('success', 'Connection restored');
});

window.addEventListener('offline', function() {
    showAlert('error', 'Connection lost. Some features may not work.');
});

// Page visibility API for performance optimization
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause animations or intensive operations
    } else {
        // Resume animations or operations
    }
});

console.log('Zactrix Digital Agency - Website loaded successfully!');
