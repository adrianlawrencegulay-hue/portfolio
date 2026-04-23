// ========================================
// NAVIGATION
// ========================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
    });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const offset = target.offsetTop - 80;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
    });
});

// ========================================
// REVEAL ON SCROLL
// ========================================
document.body.classList.add('js-ready');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            entry.target.style.transitionDelay = `${i * 0.08}s`;
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ========================================
// SKILL BARS
// ========================================
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.sb-fill').forEach(bar => {
                const target = bar.style.width;
                bar.style.width = '0';
                requestAnimationFrame(() => {
                    setTimeout(() => { bar.style.width = target; }, 100);
                });
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-cat').forEach(cat => skillObserver.observe(cat));

// ========================================
// CAROUSELS — original working version
// ========================================
function initCarousels() {
    const carousels = document.querySelectorAll('.project-carousel');

    carousels.forEach(carousel => {
        const images = carousel.querySelectorAll('.carousel-img');
        const dots = carousel.querySelectorAll('.dot');
        let currentIndex = 0;
        let autoplayInterval;

        // Hide nav if only 1 slide
        if (images.length <= 1) {
            const prev = carousel.querySelector('.carousel-prev');
            const next = carousel.querySelector('.carousel-next');
            const dotsWrap = carousel.querySelector('.carousel-dots');
            if (prev) prev.style.display = 'none';
            if (next) next.style.display = 'none';
            if (dotsWrap) dotsWrap.style.display = 'none';
        }

        function startAutoplay() {
            autoplayInterval = setInterval(() => {
                showSlide((currentIndex + 1) % images.length);
            }, 5000);
        }

        function stopAutoplay() {
            clearInterval(autoplayInterval);
        }

        function showSlide(index) {
            images.forEach(img => img.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            currentIndex = index;
            images[currentIndex].classList.add('active');
            if (dots[currentIndex]) dots[currentIndex].classList.add('active');
        }

        carousel.showSlide = showSlide;
        carousel.getCurrentIndex = () => currentIndex;
        carousel.getTotalSlides = () => images.length;

        if (images.length > 1) startAutoplay();
        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', () => { if (images.length > 1) startAutoplay(); });
    });
}

// Call initCarousels when DOM is ready
document.addEventListener('DOMContentLoaded', initCarousels);

function moveCarousel(button, direction) {
    const carousel = button.closest('.project-carousel');
    const currentIndex = carousel.getCurrentIndex();
    const total = carousel.getTotalSlides();
    const newIndex = (currentIndex + direction + total) % total;
    carousel.showSlide(newIndex);
}

function goToSlide(dot, index) {
    const carousel = dot.closest('.project-carousel');
    carousel.showSlide(index);
}

// ========================================
// IMAGE VIEWER
// ========================================
let viewerImgs = [];
let viewerIdx = 0;

function expandImages(btn) {
    const card = btn.closest('.project');
    // Only pick img slides (not placeholder divs)
    const slides = Array.from(card.querySelectorAll('.slide')).filter(s => s.tagName === 'IMG');
    if (slides.length === 0) return; // no real screenshots yet
    viewerImgs = slides.map(s => s.src);
    viewerIdx = 0;
    openViewer();
}

function openViewer() {
    const viewer = document.getElementById('imageViewer');
    const img = document.getElementById('viewerImg');
    const cur = document.getElementById('vCur');
    const tot = document.getElementById('vTotal');
    const thumbs = document.getElementById('viewerThumbs');

    img.src = viewerImgs[viewerIdx];
    cur.textContent = viewerIdx + 1;
    tot.textContent = viewerImgs.length;

    thumbs.innerHTML = '';
    viewerImgs.forEach((src, i) => {
        const t = document.createElement('img');
        t.src = src;
        t.className = 'viewer-thumb' + (i === viewerIdx ? ' active' : '');
        t.onclick = () => { viewerIdx = i; updateViewer(); };
        thumbs.appendChild(t);
    });

    viewer.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function updateViewer() {
    document.getElementById('viewerImg').src = viewerImgs[viewerIdx];
    document.getElementById('vCur').textContent = viewerIdx + 1;
    document.querySelectorAll('.viewer-thumb').forEach((t, i) => {
        t.classList.toggle('active', i === viewerIdx);
    });
}

function closeViewer() {
    document.getElementById('imageViewer').classList.remove('open');
    document.body.style.overflow = '';
}

function viewerNav(dir) {
    viewerIdx = (viewerIdx + dir + viewerImgs.length) % viewerImgs.length;
    updateViewer();
}

document.addEventListener('keydown', e => {
    const viewer = document.getElementById('imageViewer');
    if (!viewer.classList.contains('open')) return;
    if (e.key === 'Escape') closeViewer();
    if (e.key === 'ArrowLeft') viewerNav(-1);
    if (e.key === 'ArrowRight') viewerNav(1);
});

// ========================================
// HERO TEXT STAGGER ANIMATION
// ========================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    const heroEls = document.querySelectorAll(
        '.availability-pill, .hero-heading, .hero-sub, .hero-actions, .hero-metrics, .hero-img-frame, .scroll-hint'
    );
    heroEls.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = `opacity 0.7s ease, transform 0.7s ease`;
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100 + i * 100);
    });
});

// ========================================
// PROJECT FEATURES — SHOW MORE / SHOW LESS
// ========================================
function toggleProjectFeats(btn) {
    const featsContainer = btn.closest('.project-feats');
    const extras = featsContainer.querySelectorAll('.feat-extra');
    const label = btn.querySelector('.show-more-label');
    const isOpen = btn.classList.contains('is-open');

    extras.forEach(el => el.classList.toggle('is-visible', !isOpen));
    btn.classList.toggle('is-open', !isOpen);
    label.textContent = isOpen ? 'Show more' : 'Show less';
}

// ========================================
// CONSOLE SIGNATURE
// ========================================
console.log('%c ALG ', 'background:#C9A84C;color:#0E0E0E;font-size:20px;font-weight:bold;padding:4px 12px;border-radius:4px;');
console.log('%cAdrian Lawrence Gulay — Android Developer', 'color:#C9A84C;font-size:14px;');
console.log('%c📧 adrianlawrence.gulay@gmail.com', 'color:#B8B0A0;font-size:12px;');
