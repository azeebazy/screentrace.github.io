// Initialize ScrollReveal for scroll animations
const sr = ScrollReveal({
    origin: 'bottom',
    distance: '20px',
    duration: 1000,
    delay: 200,
    easing: 'ease-out',
    reset: false
});

// Animate product cards
sr.reveal('.product-card', {
    interval: 100,
    scale: 0.95
});

// Animate testimonial cards
sr.reveal('.testimonial-card', {
    interval: 100,
    scale: 0.95
});

// Animate section headings
sr.reveal('h2', {
    origin: 'left',
    distance: '50px',
    duration: 1200
});

// Handle sticky navigation
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add/remove background when scrolling
    if (currentScroll > 50) {
        navbar.classList.add('bg-gray-900/95', 'backdrop-blur-sm', 'shadow-lg');
    } else {
        navbar.classList.remove('bg-gray-900/95', 'backdrop-blur-sm', 'shadow-lg');
    }

    // Hide/show navbar based on scroll direction
    if (currentScroll > lastScroll && currentScroll > 500) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

// Mobile menu functionality
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    // Add slide animation
    if (!mobileMenu.classList.contains('hidden')) {
        mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
    } else {
        mobileMenu.style.maxHeight = '0';
    }
});

// Close mobile menu when clicking a link
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenu.style.maxHeight = '0';
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Parallax effect for about section background
window.addEventListener('scroll', () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection && window.innerWidth >= 768) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        aboutSection.style.backgroundPosition = `center ${rate}px`;
    }
});

// Add active state to navigation links based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - sectionHeight / 3) {
            const currentSection = section.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('text-indigo-400');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('text-indigo-400');
                }
            });
        }
    });
});

// Intersection Observer for fade-in animations
const fadeElements = document.querySelectorAll('.product-card, .testimonial-card');
const fadeOptions = {
    threshold: 0.3,
    rootMargin: '0px'
};

const fadeOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, fadeOptions);

fadeElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'all 0.6s ease-out';
    fadeOnScroll.observe(element);
}); 