# VoyageXperience

VoyageXperience est une application mobile qui permet aux utilisateurs de découvrir des restaurants et des activités lors de leurs voyages.

## Structure du projet

Le projet est divisé en deux parties principales : le back-end et le front-end.

### Back-End

Le back-end est construit avec Node.js et utilise Prisma pour la gestion de la base de données. Il contient les migrations de la base de données et le schéma Prisma dans le dossier `prisma/`.

- [Back-End README](Back-End/README.md)
- [Prisma Schema](Back-End/prisma/schema.prisma)

### Front-End

Le front-end est une application React Native. Il contient tous les écrans de l'application dans le dossier `screens/` et les ressources globales comme les images et les styles dans le dossier `assets/`.

- [Front-End README](Front-End/.expo/README.md)
- [App Entry Point](Front-End/VoyageX-App/App.js)

## Comment démarrer le projet

1. Clonez le dépôt
2. Installez les dépendances avec `npm install` dans les dossiers `Back-End` et `Front-End/VoyageX-App`
3. Démarrez le serveur back-end avec `npm start` dans le dossier `Back-End`
4. Démarrez l'application front-end avec `npm start` dans le dossier `Front-End/VoyageX-App`

## Contribution

Si vous souhaitez contribuer au projet, veuillez lire les [directives de contribution](CONTRIBUTING.md).

## Licence

VoyageXperience est sous licence [MIT](LICENSE).
