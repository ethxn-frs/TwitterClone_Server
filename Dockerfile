# Utiliser une image Node.js légère
FROM node:latest

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie le fichier package.json et package-lock.json (si présent)
COPY package*.json ./

# Installe les dépendances sans dépendances natives
RUN npm install --production

# Copie le reste de l'application dans le conteneur
COPY . .

RUN npm run build

# Expose le port sur lequel l'application tourne
EXPOSE 4000

# Commande pour démarrer l'application
CMD ["npm", "run", "serve"]
