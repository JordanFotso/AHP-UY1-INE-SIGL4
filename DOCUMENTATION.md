# Documentation Technique - AHP Decision Studio

## 1. Présentation du Projet
**AHP Decision Studio** est une application web moderne conçue pour aider à la prise de décision complexe en utilisant la méthode **Analytical Hierarchy Process (AHP)**, développée par Thomas L. Saaty. L'outil permet de décomposer un problème de décision en une hiérarchie de critères et d'alternatives, facilitant ainsi un choix objectif et mathématiquement fondé.

## 2. Informations sur l'Auteur
- **Nom :** FOTSO BOPDA ACHILLE JORDAN
- **Matricule :** 22T2961
- **GitHub :** [github.com/JordanFotso](https://github.com/JordanFotso)

## 3. Stack Technique
L'application repose sur les technologies les plus récentes de l'écosystème web :
- **Framework :** [Next.js 16](https://nextjs.org/) (App Router)
- **Bibliothèque UI :** [React 19](https://react.dev/)
- **Langage :** [TypeScript](https://www.typescriptlang.org/)
- **Stylisation :** [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Composants :** [Shadcn UI](https://ui.shadcn.com/) (basé sur Radix UI)
- **Visualisation :** [Recharts](https://recharts.org/) (pour les graphiques de classement)
- **Icônes :** [Lucide React](https://lucide.dev/)

## 4. Installation et Lancement

### Prérequis
- Node.js (Version 18 ou supérieure)
- npm ou pnpm

### Installation des dépendances
```bash
npm install
# ou
pnpm install
```

### Lancement en mode développement
```bash
npm run dev
# ou
pnpm dev
```
L'application sera accessible sur `http://localhost:3000`.

## 5. Fonctionnement de l'Application

### Étape 1 : Configuration
L'utilisateur définit ses **Critères** (ex: Prix, Qualité, Délais) et ses **Options/Alternatives** (ex: Fournisseur A, Fournisseur B). Chaque élément est géré via des cartes interactives permettant l'ajout, la suppression et le renommage direct.

### Étape 2 : Analyse (Comparaison par paires)
C'est le cœur de la méthode AHP. L'utilisateur compare l'importance relative de chaque critère par rapport aux autres en utilisant l'échelle de Saaty (de 1 à 9).
- **1** : Importance égale.
- **3** : Importance modérée.
- **5** : Importance forte.
- **7** : Importance très forte.
- **9** : Importance extrême.

### Étape 3 : Évaluation des Options
Chaque alternative est notée (de 0 à 100) par rapport à chaque critère défini précédemment.

### Étape 4 : Résultats et Ranking
L'application calcule :
1. **Les poids des critères** : L'importance pondérée de chaque critère dans le choix final.
2. **Le Ratio de Cohérence (CR)** : Vérifie si les comparaisons de l'utilisateur sont logiques. Un CR < 0.1 est considéré comme cohérent.
3. **Le Classement Final** : Un score global est attribué à chaque alternative, identifiant ainsi le meilleur choix.

## 6. Structure du Code
- `/app` : Contient les routes et le layout principal.
- `/components` : Composants métier (Gestion, Matrices, Résultats).
- `/components/ui` : Composants d'interface réutilisables (Shadcn UI).
- `page.tsx` : Orchestre la logique métier et le calcul mathématique de l'AHP.

---
*Projet réalisé dans le cadre académique par FOTSO BOPDA ACHILLE JORDAN.*
