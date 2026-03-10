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
