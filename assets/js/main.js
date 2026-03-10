import { initThemeToggle } from './theme.js';
import { initMenuToggle } from './menu.js';
import { initScrollReveal } from './reveal.js';
import { initAccordion } from './accordion.js';
import { initLightbox } from './lightbox.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialiser les modules de base
    initThemeToggle();
    initMenuToggle();
    initScrollReveal();

    // Charger des modules si nécessaire
    if (document.querySelector('.accordion')) {
        initAccordion();
    }
    if (document.querySelector('.lightbox-gallery')) {
        initLightbox();
    }
});

// Le chatbot est directement inclus dans chaque page, pas besoin de l'injecter dynamiquement
