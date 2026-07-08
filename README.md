# Mini Plateforme de Livraison

Application Full Stack inspirée du fonctionnement d'Uber Eats.

Ce projet a été réalisé dans le cadre d'un test technique. Il met en œuvre une architecture complète avec authentification, gestion des rôles, API REST, gestion des commandes et suivi public des livraisons.

---

# Technologies utilisées

## Frontend

- Next.js
- Tailwind CSS
- React Hook Form
- Zod
- Framer Motion

## Backend

- Next.js API Routes
- NextAuth.js (JWT)
- bcrypt
- MongoDB
- Mongoose

---

# Fonctionnalités

## Commerce

- Création d'un compte
- Connexion
- Création de commandes
- Consultation des commandes
- Attribution d'une commande à un livreur

## Livreur

- Création d'un compte
- Connexion
- Consultation des commandes qui lui sont attribuées
- Mise à jour du statut d'une commande :
  - Assignée
  - En livraison
  - Livrée

## Client

- Aucun compte requis
- Accès à une page publique via un identifiant unique
- Suivi de l'état de la commande

---

# Installation du projet

## 1. Installer Node.js

Le projet nécessite Node.js (version 22 ou supérieure recommandée).

   - Télécharger : https://nodejs.org/dist/v22.13.1/node-v22.13.1-x64.msi
   - Lancer l'installateur et suivre les étapes (tout par défaut)
   - Vérifier l'installation : ouvrir CMD et taper :
        node -v
        npm -v
     
     Doit afficher quelque chose comme : v22.x.x


---

## 2. Installer MongoDB

### Option 1 (recommandée)

Installer MongoDB Community Server localement :

   - Télécharger : https://www.mongodb.com/try/download/community
   - Choisir : MSI
   - Lors de l'installation, cocher :
        "Install MongoDB as a Service"
        "Install MongoDB Compass"
   - Laisser tout le reste par défaut
   - Après installation, ouvrir MongoDB Compass pour vérifier
     que la connexion fonctionne sur : mongodb://localhost:27017


### Option 2

Utiliser MongoDB Atlas :

https://www.mongodb.com/atlas/database

Dans ce cas, il suffit de remplacer la variable `MONGODB_URI` du fichier `.env` par votre propre chaîne de connexion.

---


## 3. Installer les dépendances

```bash
npm install
```

---

## 4. Lancer le projet

Mode développement :

```bash
npm run dev
```

L'application sera disponible sur :

```
http://localhost:3000
```

---


# Choix techniques

## Next.js

Next.js a été choisi afin de développer le frontend et les API REST au sein d'un même projet. Cette approche permet de simplifier l'architecture, de réduire la complexité du développement et de centraliser l'ensemble de l'application. Pour une marketplace de livraison de petite à moyenne taille, cette solution est particulièrement adaptée tout en restant facilement évolutive.

---

## MongoDB

MongoDB a été retenu pour sa flexibilité et son modèle orienté documents. Les entités manipulées dans cette application (utilisateurs et commandes) peuvent évoluer au fil du développement sans nécessiter de migrations complexes. Cette approche facilite également l'ajout de nouvelles fonctionnalités dans le futur.

---

## NextAuth.js

NextAuth.js permet de mettre en place une authentification sécurisée rapidement tout en s'intégrant naturellement avec Next.js. Son utilisation simplifie la gestion des sessions, des rôles utilisateurs et de la protection des routes de l'application.

---

## React Hook Form & Zod

Ces bibliothèques permettent de construire des formulaires performants tout en centralisant les règles de validation. Elles améliorent la qualité des données envoyées au serveur tout en offrant une meilleure expérience utilisateur.

---

## Tailwind CSS

Tailwind CSS permet de concevoir rapidement une interface moderne, responsive et facilement maintenable. Son approche utilitaire garantit également une cohérence visuelle entre les différentes pages de l'application.

---

## Framer Motion

Framer Motion a été utilisé pour intégrer des animations légères afin de rendre l'interface plus fluide et d'améliorer l'expérience utilisateur sans alourdir l'application.

---

## bcrypt

Les mots de passe sont chiffrés avant leur stockage dans la base de données afin de garantir un niveau de sécurité adapté aux bonnes pratiques actuelles.


---


# Évolutions envisagées

## Interface utilisateur

- Ajout d'un mode sombre.
- Prise en charge de plusieurs langues.
- Amélioration de l'identité visuelle de l'application.
- Optimisation de l'expérience responsive sur mobile et tablette.
- Amélioration des états de chargement (loading), des messages de confirmation et de la gestion des erreurs.
- Optimisation des performances avec des outils tels que TanStack Query (React Query), React.memo, useMemo et useCallback lorsque cela est pertinent.

---

## Backend

- Mise en place de tests unitaires et de tests d'intégration.
- Intégration de Socket.IO afin de synchroniser en temps réel les changements de statut des commandes entre le commerce, le livreur et le client.
- Ajout d'un système de notifications permettant d'informer les utilisateurs lors d'événements importants (nouvelle commande, attribution d'un livreur, changement de statut, livraison terminée...).
- Optimisation des requêtes MongoDB.
- Mise en place de la pagination, du filtrage et de la recherche pour faciliter la gestion d'un grand nombre de commandes.
- Centralisation des logs et amélioration de la gestion globale des erreurs.
- Mise en cache de certaines données fréquemment consultées afin de réduire les temps de réponse.
