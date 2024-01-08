# Utiliza una imagen oficial de Node como imagen base
FROM node:20

WORKDIR /app

# Copia el package.json y el package-lock.json e instala las dependencias
COPY package*.json ./
RUN npm install

# Copia el resto de la aplicación
COPY . .

# Expone el puerto 7130
EXPOSE 7130

# Comando para ejecutar la aplicación
CMD ["npm", "run", "dev"]
