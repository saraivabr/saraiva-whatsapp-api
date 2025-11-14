#!/bin/bash

# ==================================
# Script de Setup Automático
# Saraiva WhatsApp API
# ==================================

set -e

echo "🚀 Bem-vindo ao Setup da Saraiva WhatsApp API!"
echo "================================================"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verifica Node.js
echo "🔍 Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não encontrado. Por favor, instale Node.js 18+ primeiro.${NC}"
    echo "   Download: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${YELLOW}⚠️  Node.js versão $NODE_VERSION detectada. Recomendamos versão 18+${NC}"
else
    echo -e "${GREEN}✅ Node.js $(node -v) encontrado${NC}"
fi

# Verifica npm
echo "🔍 Verificando npm..."
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm não encontrado.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm $(npm -v) encontrado${NC}"

# Função para gerar token seguro
generate_token() {
    openssl rand -hex 32 2>/dev/null || node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
}

# Verifica se .env já existe
if [ -f .env ]; then
    echo ""
    echo -e "${YELLOW}⚠️  Arquivo .env já existe.${NC}"
    read -p "Deseja sobrescrever? (s/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo "Mantendo .env existente."
        SKIP_ENV=true
    fi
fi

# Cria .env se necessário
if [ "$SKIP_ENV" != true ]; then
    echo ""
    echo "📝 Configurando variáveis de ambiente..."

    # Gera tokens seguros
    TOKEN=$(generate_token)
    ADMINTOKEN=$(generate_token)
    SESSION_SECRET=$(generate_token)
    COOKIE_SECRET=$(generate_token)

    # Pergunta porta
    read -p "🔌 Porta do servidor (padrão: 3333): " PORT
    PORT=${PORT:-3333}

    # Pergunta ambiente
    echo ""
    echo "🌍 Ambiente de execução:"
    echo "  1) development (desenvolvimento)"
    echo "  2) production (produção)"
    read -p "Escolha (1 ou 2, padrão: 1): " ENV_CHOICE

    if [ "$ENV_CHOICE" = "2" ]; then
        NODE_ENV="production"
        LOG_LEVEL="info"
        PROTECT_ROUTES="true"
    else
        NODE_ENV="development"
        LOG_LEVEL="debug"
        PROTECT_ROUTES="false"
    fi

    # Cria arquivo .env
    cat > .env << EOF
# ==================================
# CONFIGURAÇÃO GERADA AUTOMATICAMENTE
# Data: $(date)
# ==================================

# Segurança
TOKEN=$TOKEN
ADMINTOKEN=$ADMINTOKEN
PROTECT_ROUTES=$PROTECT_ROUTES
MAX_INSTANCES=50

# Aplicação
NODE_ENV=$NODE_ENV
PORT=$PORT
APP_URL=http://localhost:$PORT
RESTORE_SESSIONS_ON_START_UP=true
LOG_LEVEL=$LOG_LEVEL

# Gerenciador Web
USER=admin
PASSWORD=admin
SESSION_SECRET=$SESSION_SECRET
COOKIE_SECRET=$COOKIE_SECRET

# Mídia
videoMimeTypes=video/mp4,video/avi,video/mkv,video/quicktime,video/x-msvideo,video/x-matroska
audioMimeTypes=audio/mp3,audio/wav,audio/ogg,audio/mpeg
documentMimeTypes=application/pdf,application/msword,application/vnd.ms-excel,application/vnd.ms-powerpoint
imageMimeTypes=image/jpeg,image/png,image/gif,image/jpg
DEFAULT_AUDIO_OUTPUT=OGG
EOF

    echo -e "${GREEN}✅ Arquivo .env criado com tokens seguros!${NC}"

    # Mostra informações importantes
    echo ""
    echo "🔐 INFORMAÇÕES IMPORTANTES - GUARDE COM SEGURANÇA!"
    echo "=================================================="
    echo -e "Token de API: ${YELLOW}$TOKEN${NC}"
    echo -e "Token Admin:  ${YELLOW}$ADMINTOKEN${NC}"
    echo -e "Porta:        ${YELLOW}$PORT${NC}"
    echo -e "Ambiente:     ${YELLOW}$NODE_ENV${NC}"
    echo ""
    echo "💡 Use estes tokens nas requisições HTTP:"
    echo "   Authorization: Bearer $TOKEN"
    echo ""
fi

# Instala dependências
echo ""
echo "📦 Instalando dependências..."
if npm install; then
    echo -e "${GREEN}✅ Dependências instaladas com sucesso!${NC}"
else
    echo -e "${RED}❌ Erro ao instalar dependências${NC}"
    exit 1
fi

# Cria diretórios necessários
echo ""
echo "📁 Criando diretórios necessários..."
mkdir -p sessions temp logs
echo -e "${GREEN}✅ Diretórios criados${NC}"

# Oferece iniciar o servidor
echo ""
echo "================================================"
echo -e "${GREEN}✅ Setup concluído com sucesso!${NC}"
echo "================================================"
echo ""
echo "🚀 Próximos passos:"
echo ""
echo "  1. Iniciar servidor:"
echo "     npm start"
echo ""
echo "  2. Iniciar em desenvolvimento (com hot-reload):"
echo "     npm run dev"
echo ""
echo "  3. Usar Docker:"
echo "     docker-compose up -d"
echo ""
echo "  4. Ver documentação:"
echo "     cat README.md"
echo ""
echo "  5. Testar API:"
echo "     curl http://localhost:$PORT/health"
echo ""

# Pergunta se quer iniciar agora
read -p "Deseja iniciar o servidor agora? (s/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo ""
    echo "🚀 Iniciando servidor..."
    npm start
fi
