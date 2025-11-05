/**
 * Interactions Module
 * Handles button hover effects and card interactions
 */

export function initInteractions() {
    // Add glow effect to buttons on hover
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.05)';
        });

        btn.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
        });
    });

    // Service Card Hover Effects
    // Apply to all service cards - mouse-tilt will override for mouse-tilt-container
    // Note: All cards should have mouse-tilt-container class for consistent mouse-following tilt effect
    document.querySelectorAll('.service-card:not(.mouse-tilt-container)').forEach(card => {
        // Only apply fallback transform if card doesn't have mouse-tilt
        // (Most cards should have mouse-tilt-container for mouse-following tilt)
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Project Card Animation
    document.querySelectorAll('.project-card-large').forEach(card => {
        card.addEventListener('mouseenter', function () {
            const overlay = this.querySelector('.project-overlay');
            if (overlay) {
                overlay.style.opacity = '1';
            }
        });

        card.addEventListener('mouseleave', function () {
            const overlay = this.querySelector('.project-overlay');
            if (overlay) {
                overlay.style.opacity = '0';
            }
        });
    });
}
