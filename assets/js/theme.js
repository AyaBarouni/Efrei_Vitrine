export function initThemeToggle() {
    const toggleButton = document.querySelector('.theme-toggle');
    if (!toggleButton) return;

    // 1. Récupérer la préférence stockée ou utiliser la préférence système
    const storedTheme = localStorage.getItem('theme');
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = storedTheme || systemPreference;

    // 2. Appliquer le thème initial
    if (initialTheme === 'light') {
        document.body.classList.add('theme-light');
        toggleButton.setAttribute('aria-label', 'Activer le mode sombre');
        toggleButton.innerHTML = '🌞';
    } else {
        // Le mode sombre est la base, pas besoin de classe pour le mode sombre
        toggleButton.setAttribute('aria-label', 'Activer le mode clair');
        toggleButton.innerHTML = '🌙';
    }

    // 3. Écouteur pour le changement de thème
    toggleButton.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('theme-light');
        const newTheme = isLight ? 'light' : 'dark';
        
        // Mettre à jour localStorage et l'UI
        localStorage.setItem('theme', newTheme);
        toggleButton.setAttribute('aria-label', `Activer le mode ${isLight ? 'sombre' : 'clair'}`);
        toggleButton.innerHTML = isLight ? '🌞' : '🌙';
    });
}