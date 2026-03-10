/* EFREI Vitrine - Bundle JS (compatible file://, no modules) */
(function(){
  'use strict';

  // Mark JS enabled (used by CSS fallback)
  document.documentElement.classList.add('js');

function initThemeToggle() {
    const toggleButton = document.querySelector('.theme-toggle');
    if (!toggleButton) return;
    /**
     * Récupère le thème en cours depuis l'URL (paramètre ?theme=dark),
     * sinon depuis localStorage. Si aucun n'est défini, renvoie 'light'.
     */
    function getInitialTheme() {
        // Vérifier les paramètres d'URL pour forcer le thème
        const params = new URLSearchParams(window.location.search);
        const queryTheme = params.get('theme');
        if (queryTheme === 'dark' || queryTheme === 'light') {
            return queryTheme;
        }
        // Sinon, consulter localStorage (non partagé en file:// mais utile en HTTP)
        const stored = localStorage.getItem('theme');
        return stored || 'light';
    }

    /**
     * Met à jour tous les liens internes (.html) pour préserver le thème actif.
     * Si le thème est sombre, ajoute ?theme=dark aux URLs internes.
     * Si le thème est clair, retire ce paramètre.
     */
    function updateInternalLinks(theme) {
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;
            // Ne modifie pas les liens externes, les ancres ou ceux qui ouvrent dans un nouvel onglet
            if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('#') || link.target === '_blank') {
                return;
            }
            // N'intervient que sur les fichiers HTML de cette vitrine
            if (!/\.html(\?|$)/.test(href)) return;
            try {
                const url = new URL(href, window.location.href);
                if (theme === 'dark') {
                    url.searchParams.set('theme', 'dark');
                } else {
                    url.searchParams.delete('theme');
                }
                link.setAttribute('href', url.pathname + url.search + url.hash);
            } catch (e) {
                // Sur certains navigateurs en file://, new URL peut échouer ; ignorer
            }
        });
    }

    /**
     * Applique un thème donné au document et met à jour le bouton et les liens.
     */
    function applyTheme(theme) {
        const isLight = theme === 'light';
        if (isLight) {
            document.body.classList.add('theme-light');
        } else {
            document.body.classList.remove('theme-light');
        }
        // Mettre à jour l'interface du bouton
        toggleButton.setAttribute('aria-label', `Activer le mode ${isLight ? 'sombre' : 'clair'}`);
        toggleButton.innerHTML = isLight ? '🌞' : '🌙';
        // Tenter de stocker dans localStorage (si disponible)
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {}
        updateInternalLinks(theme);
    }

    // 1. Appliquer le thème initial en fonction de l'URL ou du stockage
    const initialTheme = getInitialTheme();
    applyTheme(initialTheme);

    // 2. Écouteur de clic sur le bouton pour basculer le thème
    toggleButton.addEventListener('click', () => {
        // Déterminer le thème courant
        const isCurrentlyLight = document.body.classList.contains('theme-light');
        const newTheme = isCurrentlyLight ? 'dark' : 'light';
        applyTheme(newTheme);
    });
}

function initMenuToggle() {
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

function initScrollReveal() {
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

/**
 * Module JS pour gérer le composant Accordion (FAQ).
 * Assure l'accessibilité (ARIA, focus clavier).
 */
function initAccordion() {
    // Sélecteur général de l'accordion
    const accordions = document.querySelectorAll('.accordion');

    accordions.forEach(accordion => {
        // Sélectionne tous les boutons qui servent de titre
        const buttons = accordion.querySelectorAll('.accordion-header button');

        buttons.forEach(button => {
            // Cible le panneau de contenu associé via l'attribut aria-controls
            const contentId = button.getAttribute('aria-controls');
            const contentPanel = document.getElementById(contentId);

            if (!contentPanel) {
                console.error(`Panneau de contenu introuvable pour l'ID: ${contentId}`);
                return;
            }
            
            // État initial: tous sont fermés sauf indication contraire
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            contentPanel.hidden = !isExpanded; // Gérer l'état initial du contenu

            button.addEventListener('click', () => {
                // 1. Déterminer l'état actuel
                const currentlyExpanded = button.getAttribute('aria-expanded') === 'true';

                // 2. Fermer tous les autres (comportement 'solo' si on veut n'avoir qu'un seul ouvert à la fois)
                // Si l'on souhaite un comportement où plusieurs peuvent être ouverts, retirer cette boucle.
                // Pour une FAQ, on préfère souvent n'en ouvrir qu'un.
                buttons.forEach(otherButton => {
                    if (otherButton !== button) {
                        const otherContentId = otherButton.getAttribute('aria-controls');
                        const otherContentPanel = document.getElementById(otherContentId);

                        otherButton.setAttribute('aria-expanded', 'false');
                        if (otherContentPanel) {
                            otherContentPanel.hidden = true;
                        }
                    }
                });

                // 3. Basculer l'état de l'élément cliqué
                button.setAttribute('aria-expanded', String(!currentlyExpanded));
                contentPanel.hidden = currentlyExpanded; // Basculer la visibilité

                // OPTIONNEL: Si l'on ferme, s'assurer que le focus reste sur le bouton
                if (currentlyExpanded) {
                    button.focus();
                }
            });

            // Gérer la navigation clavier (flèches haut/bas pour passer d'un titre à l'autre)
            button.addEventListener('keydown', (e) => {
                const index = Array.from(buttons).indexOf(button);
                let nextIndex = index;

                switch (e.key) {
                    case 'ArrowDown':
                        nextIndex = (index + 1) % buttons.length;
                        buttons[nextIndex].focus();
                        e.preventDefault();
                        break;
                    case 'ArrowUp':
                        nextIndex = (index - 1 + buttons.length) % buttons.length;
                        buttons[nextIndex].focus();
                        e.preventDefault();
                        break;
                    case 'Home':
                        buttons[0].focus();
                        e.preventDefault();
                        break;
                    case 'End':
                        buttons[buttons.length - 1].focus();
                        e.preventDefault();
                        break;
                }
            });
        });
    });
}

/**
 * Module JS pour filtrer les cartes d'actualités par catégorie.
 * Ce script remplace l'ancien code inline dans actus.html. Il détecte
 * la présence d'un conteneur .actus-filters et ajoute un écouteur de clic
 * sur chaque bouton pour afficher/masquer les cartes en conséquence.
 */
function initActusFilter() {
    const filterButtons = document.querySelectorAll('.actus-filters .filter-button');
    const cards = document.querySelectorAll('.actu-card');
    if (!filterButtons.length || !cards.length) return;
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            // mettre à jour l'état actif sur les boutons
            filterButtons.forEach(btn => {
                const isActive = btn === button;
                btn.classList.toggle('is-active', isActive);
                btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            });
            // afficher ou masquer les cartes
            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/**
 * Module JS pour gérer la Lightbox/Galerie photo.
 * Assure l'accessibilité (Échap, Flèches, Focus Trap).
 */
function initLightbox() {
    const gallery = document.querySelector('.lightbox-gallery');
    if (!gallery) return;

    // 1. Création et insertion de la structure de la Lightbox
    // Inject the Lightbox markup with both the native `hidden` attribute and an
    // inline `display:none` style. In file:// contexts some browsers ignore
    // `hidden`, so the inline style prevents the overlay from appearing
    // prematurely until JavaScript removes it.
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
    
    // Éléments interactifs pour le focus trap
    const focusableElements = [closeButton, prevButton, nextButton];

    // Liste de toutes les images de la galerie
    const images = Array.from(gallery.querySelectorAll('a')); 
    let currentIndex = 0;
    let originalActiveElement = null; // Élément qui a ouvert la lightbox

    // Fonction pour ouvrir la lightbox
    function openLightbox(index) {
        if (images.length === 0) return;
        currentIndex = index;
        originalActiveElement = document.activeElement;
        
        updateLightbox();
        // Ajoute la classe `open` pour afficher la lightbox. Retire à la fois
        // l'attribut `hidden` et l'inline `display:none` afin que la lightbox
        // soit visible. Cette double gestion permet de garantir le
        // fonctionnement dans des environnements file:// où `hidden` seul
        // n'est pas respecté.
        lightbox.classList.add('open');
        lightbox.hidden = false;
        lightbox.style.display = '';
        
        // Déplace le focus sur le bouton de fermeture lors de l'ouverture
        closeButton.focus();
    }

    // Fonction pour fermer la lightbox
    function closeLightbox() {
        // Retire la classe `open` et réapplique `hidden` ainsi qu'un
        // `display:none` en ligne pour garantir que la lightbox soit
        // complètement masquée.
        lightbox.classList.remove('open');
        lightbox.hidden = true;
        lightbox.style.display = 'none';
        
        // Rendre le focus à l'élément qui a ouvert la modale
        if (originalActiveElement) {
            originalActiveElement.focus();
        }
    }

    // Fonction pour mettre à jour l'image affichée
    function updateLightbox() {
        const currentImageLink = images[currentIndex];
        const imgSrc = currentImageLink.href;
        const imgAlt = currentImageLink.querySelector('img').alt || `Image de la galerie ${currentIndex + 1}`;
        
        lightboxImage.src = imgSrc;
        lightboxImage.alt = imgAlt;
        
        // Désactiver les boutons de navigation si on est aux extrémités
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

// chatbot.js

(function () {
    const container   = document.querySelector(".chatbot");
    if (!container) return;

    const toggleBtn   = container.querySelector(".chatbot-toggle");
    const chatWindow  = container.querySelector(".chatbot-window");
    const closeBtn    = container.querySelector(".chatbot-close");
    const form        = container.querySelector("#chatbotForm");
    const input       = container.querySelector("#chatbotInput");
    const messagesBox = container.querySelector("#chatbotMessages");

    // ----- Ouverture / fermeture -----
    function openChat() {
        chatWindow.classList.add("open");
        input.focus();
    }

    function closeChat() {
        chatWindow.classList.remove("open");
    }

    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            chatWindow.classList.contains("open") ? closeChat() : openChat();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", closeChat);
    }

    // ----- Afficher un message -----
    function addMessage(text, sender = "bot") {
        const div = document.createElement("div");
        div.classList.add("chatbot-message", sender);
        div.innerHTML = text;
        messagesBox.appendChild(div);
        messagesBox.scrollTop = messagesBox.scrollHeight;
    }

    // ----- Réponses automatiques simples -----
// ----- Réponses automatiques simples -----
function getBotReply(q) {
    q = q.toLowerCase();

    // 👋 Salutations
    if (
        q.includes("bonjour") ||
        q.includes("salut") ||
        q.includes("bonsoir") ||
        q.includes("hello") ||
        q.includes("coucou")
    ) {
        return "Bonjour ! 😊 N’hésite pas à me poser des questions sur l’EFREI : admissions, formations, campus, alternance, etc.";
    }

    // ℹInfos générales sur l'école
    if (q.includes("efrei") || q.includes("école") || q.includes("ecole")) {
        return "L’EFREI est une école d’ingénieur spécialisée dans le numérique : informatique, IA, cybersécurité, data, réseaux, etc. Elle propose un cycle prépa + un cycle ingénieur, avec des parcours classiques et en alternance.";
    }

    // Admissions
    if (q.includes("admission") || q.includes("concours") || q.includes("inscription")) {
        return "Les admissions à l’EFREI dépendent de ton niveau (post-bac, admissions parallèles, etc.). Toutes les modalités sont détaillées sur la page Admissions du site officiel.";
    }

    // Prépa
    if (q.includes("prépa") || q.includes("prepa") || q.includes("préparatoire")) {
        return "La prépa intégrée de l’EFREI te donne les bases scientifiques et numériques avant d’entrer en cycle ingénieur.";
    }

    // Cycle ingénieur
    if (q.includes("ingénieur") || q.includes("cycle ingénieur")) {
        return "Le cycle ingénieur EFREI propose plusieurs spécialisations : IA, data, cybersécurité, software engineering, réseaux, etc.";
    }

    // Formations / programmes
    if (q.includes("formation") || q.includes("programme") || q.includes("bachelor") || q.includes("master")) {
        return "L’EFREI propose des bachelors, un cycle ingénieur et des formations en lien avec le numérique. Tu peux voir la liste complète des programmes sur la page Formations du site.";
    }

    // Alternance
    if (q.includes("alternance") || q.includes("apprentissage")) {
        return "L’alternance est possible dans plusieurs parcours, surtout en cycle ingénieur. L’école a un gros réseau d’entreprises partenaires.";
    }

    // Campus
    if (q.includes("campus") || q.includes("adresse") || q.includes("où") || q.includes("ou se trouve")) {
        return "Le campus principal est à Villejuif, métro Ligne 7 (station Villejuif – Léo Lagrange).";
    }

    // Contact
    if (q.includes("contact") || q.includes("mail") || q.includes("téléphone")) {
        return "Pour contacter l’école, le plus simple est de passer par la page Contact du site officiel : tu y trouveras formulaires, mails et numéros utiles.";
    }

    // Réponse par défaut
    return "Je ne suis pas sûr d’avoir compris 🤔<br>Essaie de reformuler ta question ou précise si tu veux une info sur les admissions, les formations, le campus ou l’alternance.";
}


    // ----- Envoi du message -----
    if (form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const text = input.value.trim();
            if (!text) return;

            addMessage(text, "user");
            input.value = "";

            setTimeout(() => addMessage(getBotReply(text), "bot"), 400);
        });
    }
})();


  function initAll(){
    try{ initThemeToggle && initThemeToggle(); }catch(e){}
    try{ initMenuToggle && initMenuToggle(); }catch(e){}
    try{ initScrollReveal && initScrollReveal(); }catch(e){}
    try{
      if (document.querySelector('.accordion')) initAccordion();
    }catch(e){}
    try{
      if (document.querySelector('.lightbox-gallery')) initLightbox();
    }catch(e){}
    try{
      // Chatbot: only init if container exists
      if (typeof initChatbot === 'function') initChatbot();
    }catch(e){}

    // Filtrage des actualités
    try{
      if (document.querySelector('.actus-filters')) initActusFilter();
    }catch(e){}
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();