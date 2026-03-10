/**
 * Module JS pour gérer le composant Accordion (FAQ).
 * Assure l'accessibilité (ARIA, focus clavier).
 */
export function initAccordion() {
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