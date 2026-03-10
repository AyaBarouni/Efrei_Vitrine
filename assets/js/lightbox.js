// Module Lightbox pour la galerie photo
export function initLightbox() {
    const gallery = document.querySelector('.lightbox-gallery');
    if (!gallery) return;

    // Crée et insère la structure de la lightbox
    const lightboxHTML = `
        <div id="lightbox" role="dialog" aria-modal="true" aria-label="Galerie photo du campus" class="lightbox-modal" hidden style="display:none">
            <div class="lightbox-content">
                <button class="lightbox-close" aria-label="Fermer la galerie">✕</button>
                <img id="lightbox-image" src="" alt="">
                <button class="lightbox-prev" aria-label="Image précédente">←</button>
                <button class="lightbox-next" aria-label="Image suivante">→</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);

    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const closeButton = lightbox.querySelector('.lightbox-close');
    const prevButton = lightbox.querySelector('.lightbox-prev');
    const nextButton = lightbox.querySelector('.lightbox-next');
    
    
    const focusableElements = [closeButton, prevButton, nextButton];

    
    const images = Array.from(gallery.querySelectorAll('a')); 
    let currentIndex = 0;
    let originalActiveElement = null;

    // Ouvre la lightbox
    function openLightbox(index) {
        if (images.length === 0) return;
        currentIndex = index;
        originalActiveElement = document.activeElement;
        
        updateLightbox();
        // Affiche la lightbox
        lightbox.classList.add('open');
        lightbox.hidden = false;
        lightbox.style.display = '';
        
        // Déplacer le focus sur le bouton de fermeture
        closeButton.focus();
    }

    // Ferme la lightbox
    function closeLightbox() {
        // Masque la lightbox
        lightbox.classList.remove('open');
        lightbox.hidden = true;
        lightbox.style.display = 'none';
        
        // Rendre le focus à l'élément ayant ouvert la modale
        if (originalActiveElement) {
            originalActiveElement.focus();
        }
    }

    // Met à jour l'image affichée
    function updateLightbox() {
        const currentImageLink = images[currentIndex];
        const imgSrc = currentImageLink.href;
        const imgAlt = currentImageLink.querySelector('img').alt || `Image de la galerie ${currentIndex + 1}`;
        
        lightboxImage.src = imgSrc;
        lightboxImage.alt = imgAlt;
        
        
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === images.length - 1;
    }

    // 2. Gestion des événements
    
    // Clic sur une image de la galerie
    images.forEach((link, index) => {
        // Empêcher l'ouverture normale du lien
        link.addEventListener('click', (e) => {
            e.preventDefault();
            openLightbox(index);
        });
    });

    // Clic sur les boutons de navigation et fermeture
    closeButton.addEventListener('click', closeLightbox);
    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateLightbox();
        }
    });
    nextButton.addEventListener('click', () => {
        if (currentIndex < images.length - 1) {
            currentIndex++;
            updateLightbox();
        }
    });

    // Gestion du clavier (Échap, Flèches)
    document.addEventListener('keydown', (e) => {
        if (lightbox.hidden) return; // Seulement si la lightbox est ouverte

        switch (e.key) {
            case 'Escape':
                e.preventDefault();
                closeLightbox();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                prevButton.click();
                break;
            case 'ArrowRight':
                e.preventDefault();
                nextButton.click();
                break;
            case 'Tab':
                // Piège de focus (Focus Trap)
                handleFocusTrap(e);
                break;
        }
    });
    
    // Fonction pour gérer le Focus Trap (la navigation Tab reste dans la modale)
    function handleFocusTrap(e) {
        // Trouver le premier et le dernier élément focusable
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) { // Shift + Tab
            if (document.activeElement === firstFocusable) {
                lastFocusable.focus();
                e.preventDefault();
            }
        } else { // Tab
            if (document.activeElement === lastFocusable) {
                firstFocusable.focus();
                e.preventDefault();
            }
        }
    }
}