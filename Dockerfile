# Étape 1 : Build Angular
FROM node:22 AS build
WORKDIR /app

# Copier les fichiers de configuration (package.json)
COPY package*.json ./
RUN npm install

# Copier tout le projet
COPY . .

# Build Angular en mode production
RUN npm run build

# Étape 2 : Serveur Nginx
FROM nginx:alpine

# Copier le build Angular dans Nginx (depuis le dossier browser)
COPY --from=build /app/dist/DevFlow/browser /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Lancer Nginx
CMD ["nginx", "-g", "daemon off;"]
