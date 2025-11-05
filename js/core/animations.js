/**
 * Animations Module
 * Handles scroll-triggered animations and reveal effects
 */

export function initAnimations() {
    // Scroll Animations Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all elements with fade-in-up class
    document.addEventListener('DOMContentLoaded', () => {
        const animatedElements = document.querySelectorAll('.service-card, .project-card-large, .fade-in-up');
        animatedElements.forEach(el => {
            el.classList.add('fade-in-up');
            observer.observe(el);
        });
    });

    // Text Reveal Animation on Scroll
    const textRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const text = entry.target;
                const words = text.textContent.split(' ');
                text.innerHTML = words.map((word, i) =>
                    `<span style="animation-delay: ${i * 0.1}s">${word}</span>`
                ).join(' ');
                textRevealObserver.unobserve(text);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.section-title').forEach(title => {
        textRevealObserver.observe(title);
    });

    // 3D Scroll Reveal
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal-3d');
    const scrollRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    scrollRevealElements.forEach(el => {
        scrollRevealObserver.observe(el);
    });

    // Stagger animation for service cards
    const staggerCards = () => {
        const cards = document.querySelectorAll('.service-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    };

    document.addEventListener('DOMContentLoaded', staggerCards);

    // Add loading animation
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });

    // Counting Animation for Stats Numbers
    initCountAnimation();
}

/**
 * Counting Animation
 * Animated numbers count up from 0 to target value when element comes into view
 */
function initCountAnimation() {
    const countElements = document.querySelectorAll('.count-number');
    
    if (countElements.length === 0) return;

    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCount(entry.target);
                countObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    });

    countElements.forEach(element => {
        // Store original target and suffix
        const target = parseInt(element.getAttribute('data-target')) || 0;
        const suffix = element.getAttribute('data-suffix') || '';
        element.textContent = '0' + suffix;
        countObserver.observe(element);
    });
}

function animateCount(element) {
    const target = parseInt(element.getAttribute('data-target')) || 0;
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    const startValue = 0;
    
    // Easing function for smooth animation (ease-out)
    function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    function updateCount(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        const currentValue = Math.floor(startValue + (target - startValue) * easedProgress);
        
        element.textContent = currentValue + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateCount);
        } else {
            // Ensure final value is exact
            element.textContent = target + suffix;
        }
    }

    requestAnimationFrame(updateCount);
}
