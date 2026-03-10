export function initScrollReveal() {
    const revealItems = document.querySelectorAll('.reveal-item');
    
    if (revealItems.length === 0) return;

    // Options pour l'Intersection Observer
    const options = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.2 // L'élément est considéré visible si 20% est dans le viewport
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // L'élément est dans le viewport
                entry.target.classList.add('is-visible');
                // Optionnel: Arrêter d'observer une fois révélé pour optimiser
                observer.unobserve(entry.target);
            }
        });
    }, options);

    // Démarrer l'observation pour chaque élément
    revealItems.forEach(item => {
        observer.observe(item);
    });
}