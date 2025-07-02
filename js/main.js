document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    init();
});

function init() {
    // Add event listeners to scenario cards
    const scenarioCards = document.querySelectorAll('.scenario-card');
    scenarioCards.forEach(card => {
        card.addEventListener('click', () => {
            const scenario = card.getAttribute('data-scenario');
            navigateToScenario(scenario);
        });
    });

    // Add hover effects for cards
    addCardHoverEffects();
}

function navigateToScenario(scenario) {
    // Navigate to the appropriate scenario page
    window.location.href = `adjustment.html?scenario=${scenario}`;
}

function addCardHoverEffects() {
    const cards = document.querySelectorAll('.scenario-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            // Calculate mouse position relative to the card
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate rotation based on mouse position
            const rotateX = (y / rect.height - 0.5) * 10;
            const rotateY = (x / rect.width - 0.5) * -10;
            
            // Apply the transform
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        // Reset transform when mouse leaves
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            setTimeout(() => {
                card.style.transition = 'transform 0.3s ease';
            }, 100);
        });
        
        // Remove transition when mouse enters to make movement smooth
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
    });
} 