# Imagem base
FROM node:18-alpine

# Metadados
LABEL maintainer="Fellipe Saraiva <fellipesaraivabarbosa@gmail.com>"
LABEL description="API REST WhatsApp Multi-Device - Saraiva.AI"
LABEL version="1.0.0"

# Instala dependências do sistema necessárias para FFmpeg e Sharp
RUN apk add --no-cache \
    ffmpeg \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    pixman-dev

# Cria usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Define diretório de trabalho
WORKDIR /app

# Copia arquivos de dependências
COPY --chown=nodejs:nodejs package*.json ./

# Instala dependências de produção
RUN npm ci --only=production && \
    npm cache clean --force

# Copia código da aplicação
COPY --chown=nodejs:nodejs . .

# Cria diretórios necessários
RUN mkdir -p sessions temp logs && \
    chown -R nodejs:nodejs sessions temp logs

# Muda para usuário não-root
USER nodejs

# Expõe porta da aplicação
EXPOSE 3333

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3333/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando de inicialização
CMD ["node", "src/server.js"]
