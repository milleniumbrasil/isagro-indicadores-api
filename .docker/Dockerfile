# Use a imagem oficial do Node.js
FROM node:18-alpine

# Cria um diretório de trabalho
WORKDIR /app

# Adiciona um novo grupo e usuário
RUN addgroup -S isagrogroup && adduser -S isagrouser -G isagrogroup

# Instala dependências para o node-gyp, incluindo Python e build tools
RUN apk add --no-cache python3 make g++ && ln -sf python3 /usr/bin/python

# Copia o package.json e package-lock.json para o diretório de trabalho
# Ajusta o caminho, pois agora está numa subpasta .docker
COPY ../package*.json ./

# Instala as dependências da aplicação
RUN npm install --only=production

# Instala o Nest CLI temporariamente para o build
RUN npm install @nestjs/cli

# Copia o restante do código da aplicação para o diretório de trabalho
COPY ../ ./

# Concede a permissão do diretório de trabalho ao novo usuário
RUN chown -R isagrouser:isagrogroup /app

# Adiciona o comando de build para compilar a aplicação
RUN npm run build  # Isso vai gerar os arquivos na pasta dist

# Define o usuário não root para rodar a aplicação
USER isagrouser

# Expõe a porta 3001 (já que sua aplicação está na 3001, não 3000)
EXPOSE 3001

# Comando para rodar a aplicação em modo de produção
CMD ["npm", "run", "start:prod"]
