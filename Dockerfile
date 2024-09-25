# Etapa de build
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa de produção
FROM node:18-alpine AS production
WORKDIR /app
COPY --from=build /app ./
ENV NODE_ENV=production
RUN npm install --production
CMD ["npm", "run", "start:prod"]
