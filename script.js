// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    initCustomCursor();
    initNavigation();
    initScrollAnimations();
    initCarousels();
    initSkillBars();
});

// ========================================
// CUSTOM CURSOR
// ========================================
function initCustomCursor() {
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');
    
    if (!cursorDot || !cursorOutline) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });
    
    // Smooth follow for outline
    function animateOutline() {
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        
        cursorOutline.style.left = outlineX + 'px';
        cursorOutline.style.top = outlineY + 'px';
        
        requestAnimationFrame(animateOutline);
    }
    animateOutline();
    
    // Hover effects
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-item');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.style.transform = 'scale(2)';
            cursorOutline.style.transform = 'scale(1.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursorDot.style.transform = 'scale(1)';
            cursorOutline.style.transform = 'scale(1)';
        });
    });
}

// ========================================
// NAVIGATION
// ========================================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('[data-nav-link]');
    
    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Smooth scroll and active state
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    // Close mobile menu
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                    
                    // Smooth scroll
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Highlight active section
    const sections = document.querySelectorAll('section[id]');
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-80px 0px 0px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${entry.target.id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
}

// ========================================
// SCROLL ANIMATIONS
// ========================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => observer.observe(el));
}

// ========================================
// PROJECT CAROUSELS
// ========================================
function initCarousels() {
    const carousels = document.querySelectorAll('.project-carousel');
    
    carousels.forEach(carousel => {
        const images = carousel.querySelectorAll('.carousel-img');
        const dots = carousel.querySelectorAll('.dot');
        let currentIndex = 0;
        let autoplayInterval;
        
        // Start autoplay
        function startAutoplay() {
            autoplayInterval = setInterval(() => {
                showSlide((currentIndex + 1) % images.length);
            }, 5000);
        }
        
        // Stop autoplay
        function stopAutoplay() {
            clearInterval(autoplayInterval);
        }
        
        // Show slide
        function showSlide(index) {
            images.forEach(img => img.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            currentIndex = index;
            images[currentIndex].classList.add('active');
            dots[currentIndex].classList.add('active');
        }
        
        // Store reference in carousel for external access
        carousel.showSlide = showSlide;
        carousel.getCurrentIndex = () => currentIndex;
        carousel.getTotalSlides = () => images.length;
        
        // Start autoplay
        startAutoplay();
        
        // Pause on hover
        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
    });
}

// Navigate carousel
function moveCarousel(button, direction) {
    const carousel = button.closest('.project-carousel');
    const currentIndex = carousel.getCurrentIndex();
    const total = carousel.getTotalSlides();
    const newIndex = (currentIndex + direction + total) % total;
    carousel.showSlide(newIndex);
}

// Go to specific slide
function goToSlide(dot, index) {
    const carousel = dot.closest('.project-carousel');
    carousel.showSlide(index);
}

// ========================================
// IMAGE VIEWER
// ========================================
let viewerImages = [];
let viewerCurrentIndex = 0;

function expandProjectImages(button) {
    const projectCard = button.closest('.project-card');
    const images = projectCard.querySelectorAll('.carousel-img');
    
    viewerImages = Array.from(images).map(img => img.src);
    viewerCurrentIndex = projectCard.querySelector('.carousel-img.active') 
        ? Array.from(images).indexOf(projectCard.querySelector('.carousel-img.active'))
        : 0;
    
    showViewer();
}

function showViewer() {
    const viewer = document.getElementById('imageViewer');
    const viewerImage = document.getElementById('viewerImage');
    const viewerCurrent = document.getElementById('viewerCurrent');
    const viewerTotal = document.getElementById('viewerTotal');
    const thumbnailsContainer = document.getElementById('viewerThumbnails');
    
    // Update image
    viewerImage.src = viewerImages[viewerCurrentIndex];
    viewerCurrent.textContent = viewerCurrentIndex + 1;
    viewerTotal.textContent = viewerImages.length;
    
    // Create thumbnails
    thumbnailsContainer.innerHTML = '';
    viewerImages.forEach((src, index) => {
        const thumb = document.createElement('img');
        thumb.src = src;
        thumb.className = 'viewer-thumbnail' + (index === viewerCurrentIndex ? ' active' : '');
        thumb.onclick = () => {
            viewerCurrentIndex = index;
            updateViewer();
        };
        thumbnailsContainer.appendChild(thumb);
    });
    
    viewer.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function updateViewer() {
    const viewerImage = document.getElementById('viewerImage');
    const viewerCurrent = document.getElementById('viewerCurrent');
    const thumbnails = document.querySelectorAll('.viewer-thumbnail');
    
    viewerImage.src = viewerImages[viewerCurrentIndex];
    viewerCurrent.textContent = viewerCurrentIndex + 1;
    
    thumbnails.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === viewerCurrentIndex);
    });
}

function closeViewer() {
    const viewer = document.getElementById('imageViewer');
    viewer.classList.remove('active');
    document.body.style.overflow = '';
}

function viewerNavigate(direction) {
    viewerCurrentIndex = (viewerCurrentIndex + direction + viewerImages.length) % viewerImages.length;
    updateViewer();
}

// Keyboard navigation for viewer
document.addEventListener('keydown', (e) => {
    const viewer = document.getElementById('imageViewer');
    if (!viewer.classList.contains('active')) return;
    
    switch(e.key) {
        case 'Escape':
            closeViewer();
            break;
        case 'ArrowLeft':
            viewerNavigate(-1);
            break;
        case 'ArrowRight':
            viewerNavigate(1);
            break;
    }
});

// ========================================
// SKILL BARS ANIMATION
// ========================================
function initSkillBars() {
    const skillBars = document.querySelectorAll('.level-bar');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                entry.target.style.width = '0';
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => observer.observe(bar));
}

// ========================================
// SMOOTH REVEAL ON SCROLL
// ========================================
window.addEventListener('scroll', () => {
    const reveals = document.querySelectorAll('.timeline-item, .project-card, .skill-category');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
});

// ========================================
// PERFORMANCE OPTIMIZATIONS
// ========================================

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Debounce function for scroll events
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

// Throttle function for scroll events
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

// ========================================
// PAGE LOAD ANIMATION
// ========================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animate hero elements
    const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-description, .hero-stats, .hero-cta, .hero-scroll, .hero-image');
    heroElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Smooth scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Get scroll percentage
function getScrollPercentage() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    return (winScroll / height) * 100;
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ========================================
// ANALYTICS & TRACKING (Optional)
// ========================================

// Track button clicks
document.querySelectorAll('.btn, .contact-card').forEach(element => {
    element.addEventListener('click', (e) => {
        const action = e.currentTarget.textContent.trim();
        console.log('Button clicked:', action);
        // Add your analytics tracking here
    });
});

// Track scroll depth
let maxScroll = 0;
window.addEventListener('scroll', throttle(() => {
    const scrollPercentage = getScrollPercentage();
    if (scrollPercentage > maxScroll) {
        maxScroll = scrollPercentage;
        if (maxScroll >= 25 && maxScroll < 50) {
            console.log('Scrolled 25%');
        } else if (maxScroll >= 50 && maxScroll < 75) {
            console.log('Scrolled 50%');
        } else if (maxScroll >= 75 && maxScroll < 100) {
            console.log('Scrolled 75%');
        } else if (maxScroll >= 100) {
            console.log('Scrolled 100%');
        }
    }
}, 500));

// ========================================
// ACCESSIBILITY ENHANCEMENTS
// ========================================

// Skip to main content
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && e.shiftKey === false) {
        const focusable = document.querySelectorAll(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])'
        );
        
        if (document.activeElement === focusable[0]) {
            // First focusable element - could add skip link here
        }
    }
});

// Announce page changes for screen readers
function announcePageChange(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// ========================================
// CONSOLE SIGNATURE
// ========================================
console.log(
    '%c👋 Hello! Thanks for checking out my portfolio!',
    'font-size: 16px; font-weight: bold; color: #0066FF;'
);
console.log(
    '%cInterested in working together? Let\'s connect!',
    'font-size: 14px; color: #64748B;'
);
console.log(
    '%c📧 adrianlawrence.gulay@gmail.com',
    'font-size: 14px; color: #0066FF; font-weight: bold;'
);
