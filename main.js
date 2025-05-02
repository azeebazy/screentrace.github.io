// Initialize ScrollReveal for animations
const sr = ScrollReveal({
    origin: 'bottom',
    distance: '60px',
    duration: 1000,
    delay: 200,
    reset: false
});

// Apply animations to different sections
sr.reveal('.hero-content', { origin: 'left' });
sr.reveal('.hero-image', { origin: 'right', delay: 400 });
sr.reveal('.section-title', { delay: 100 });
sr.reveal('.product-card', { interval: 200 });
sr.reveal('.testimonial-card', { interval: 200 });
sr.reveal('.about-content', { origin: 'left' });
sr.reveal('.about-image', { origin: 'right', delay: 400 });

// Navbar scroll behavior
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.classList.remove('bg-gray-900');
        navbar.classList.add('bg-transparent');
    } else {
        navbar.classList.add('bg-gray-900');
        navbar.classList.remove('bg-transparent');
    }

    if (currentScroll > lastScroll && currentScroll > 80) {
        navbar.classList.add('-translate-y-full');
    } else {
        navbar.classList.remove('-translate-y-full');
    }

    lastScroll = currentScroll;
});

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
let isMenuOpen = false;

mobileMenuBtn.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen;
    if (isMenuOpen) {
        mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
    } else {
        mobileMenu.style.maxHeight = '0';
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            if (isMenuOpen) {
                mobileMenu.style.maxHeight = '0';
                isMenuOpen = false;
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        }
    });
});

// Active navigation link highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function highlightNavLink() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('text-indigo-500');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('text-indigo-500');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNavLink);

// Product card hover effects
const productCards = document.querySelectorAll('.product-card');

productCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.querySelectorAll('ul li').forEach((li, index) => {
            li.style.transitionDelay = `${index * 100}ms`;
        });
    });

    card.addEventListener('mouseleave', () => {
        card.querySelectorAll('ul li').forEach(li => {
            li.style.transitionDelay = '0ms';
        });
    });
});

// Parallax effect for background images
let parallaxElements = document.querySelectorAll('.parallax');

window.addEventListener('scroll', () => {
    parallaxElements.forEach(element => {
        let speed = element.dataset.speed || 0.5;
        let yPos = -(window.pageYOffset * speed);
        element.style.backgroundPosition = `center ${yPos}px`;
    });
});

// Initialize AOS for additional animations
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
}); 