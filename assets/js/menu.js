export function initMenuToggle() {
    const toggleButton = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (!toggleButton || !navMenu) return;

    toggleButton.addEventListener('click', () => {
        const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true' || false;
        
        // Mettre à jour les attributs ARIA et la classe
        toggleButton.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('is-open');

        // Ajout d'une logique pour le focus management si nécessaire (future amélioration)
        if (!isExpanded) {
            // Le menu est ouvert : s'assurer que le premier élément peut être focus
            navMenu.querySelector('a')?.focus(); 
        } else {
            // Le menu est fermé : rendre le focus au bouton
            toggleButton.focus();
        }
    });

    // Optionnel : fermer le menu lors du redimensionnement (passage mobile -> desktop)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 900 && navMenu.classList.contains('is-open')) {
            navMenu.classList.remove('is-open');
            toggleButton.setAttribute('aria-expanded', 'false');
        }
    });
}