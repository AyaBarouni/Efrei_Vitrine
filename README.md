# Site Vitrine - Département Informatique EFREI Paris

Projet réalisé dans le cadre du cours **TI504N – INGE1-New** (2025-2026).  
Encadrant : Mohamed HAMIDI

🔗 **[Voir le site en ligne](https://ayabarouni.github.io/Efrei_Vitrine/)**

---

## Contexte

Dans le cadre de notre première année à l'EFREI, nous avons conçu et développé un site vitrine institutionnel pour le département d'Informatique, en HTML5, CSS3 et JavaScript pur, sans framework ni bibliothèque externe. L'objectif était de maîtriser les fondamentaux du développement web tout en collaborant efficacement à trois via Git.

---

## Fonctionnalités

### Formulaire de contact avec validation JavaScript
Avant d'envoyer un formulaire, chaque champ est vérifié côté client : format d'email, champs obligatoires, longueur minimale. Cette étape de validation en entrée est directement liée aux bonnes pratiques de sécurité web (OWASP : ne jamais faire confiance aux données utilisateur).

### Mode sombre / clair
Bascule dynamique entre thème clair et sombre via JavaScript, avec mémorisation de la préférence utilisateur.

### Chatbot intégré
Assistant virtuel permettant de répondre aux questions fréquentes sur l'EFREI : formations, admissions, vie étudiante, alternance.

### Conformité RGPD
Page de mentions légales complète incluant une section dédiée à la politique de cookies, les droits des utilisateurs (accès, rectification, suppression) et les coordonnées du DPO.

### Design responsive
Mise en page adaptée à tous les écrans via media queries CSS et Flexbox.

---

## Structure du site

Architecture à deux niveaux :

```
Niveau 0 — Accueil (index.html)
│
├── Niveau 1 — Navigation principale
│   ├── formations.html
│   ├── admissions.html
│   ├── actus.html
│   ├── entreprises.html
│   ├── campus.html
│   ├── contact.html
│   ├── a-propos.html
│   └── cycle-ingenieur.html
│
└── Niveau 2 — Sous-pages
    ├── mentions-legales.html   (← Actualités)
    ├── carrieres.html          (← Entreprises)
    └── bde.html                (← Campus)
```

---

## Équipe

| Membre | Contribution |
|---|---|
| Aya BAROUNI | Formulaire de contact avec validation JS, mentions légales (RGPD) |
| HAJI Myriam | Chatbot, mode sombre, menu interactif |
| BENHAMMADI Sara | Pages contenu (formations, admissions, campus...), design responsive |

---

## Technologies

- HTML5, CSS3 (Flexbox, Media Queries)
- JavaScript vanilla (DOM, événements, validation)
- Git / GitHub (versioning collaboratif à trois)
- GitHub Pages (déploiement)

---

## Ce que j'ai appris

- **Collaborer avec Git en équipe** : gérer des branches, résoudre des conflits de merge, maintenir un historique de commits lisible. Travailler à trois sur un même projet m'a confrontée aux vraies contraintes du travail collaboratif en développement.

- **La validation de formulaire en JavaScript** : comprendre que la validation côté client n'est pas qu'une question d'UX : c'est aussi une première ligne de défense contre les entrées malformées. Cela m'a naturellement amenée à m'intéresser à la validation côté serveur et aux principes OWASP.

- **Déployer avec GitHub Pages** : passer d'un projet local à un site accessible publiquement via une URL, gérer les chemins relatifs, comprendre le cycle commit → push → déploiement automatique.

---

*Projet réalisé dans le cadre de la formation Ingénieur – EFREI Paris, 2025-2026.*