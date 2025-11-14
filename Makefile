# ==================================
# Makefile - Comandos Úteis
# Saraiva WhatsApp API
# ==================================

.PHONY: help setup install start dev stop logs clean test lint docker-build docker-up docker-down health

# Cores
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
RESET  := $(shell tput -Txterm sgr0)

help: ## Mostra esta ajuda
	@echo '${YELLOW}Comandos disponíveis:${RESET}'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  ${GREEN}%-20s${RESET} %s\n", $$1, $$2}'

setup: ## Executa setup inicial do projeto
	@echo '${GREEN}🚀 Executando setup...${RESET}'
	@chmod +x setup.sh
	@./setup.sh

install: ## Instala dependências
	@echo '${GREEN}📦 Instalando dependências...${RESET}'
	@npm install

start: ## Inicia o servidor em produção
	@echo '${GREEN}🚀 Iniciando servidor...${RESET}'
	@npm start

dev: ## Inicia o servidor em modo desenvolvimento
	@echo '${GREEN}🔥 Iniciando em modo desenvolvimento...${RESET}'
	@npm run dev

stop: ## Para todos os processos Node
	@echo '${YELLOW}🛑 Parando processos...${RESET}'
	@pkill -f "node src/server.js" || true
	@echo '${GREEN}✅ Processos parados${RESET}'

logs: ## Mostra logs da aplicação
	@echo '${GREEN}📋 Últimos logs:${RESET}'
	@tail -f logs/*.log 2>/dev/null || echo 'Nenhum log encontrado'

clean: ## Limpa arquivos temporários e logs
	@echo '${YELLOW}🧹 Limpando arquivos temporários...${RESET}'
	@rm -rf temp/* logs/* node_modules
	@echo '${GREEN}✅ Limpeza concluída${RESET}'

test: ## Executa testes
	@echo '${GREEN}🧪 Executando testes...${RESET}'
	@npm test

lint: ## Verifica código com ESLint
	@echo '${GREEN}🔍 Verificando código...${RESET}'
	@npm run lint:check

lint-fix: ## Corrige problemas de lint automaticamente
	@echo '${GREEN}🔧 Corrigindo problemas...${RESET}'
	@npm run lint:fix

format: ## Formata código com Prettier
	@echo '${GREEN}✨ Formatando código...${RESET}'
	@npm run format:write

# Docker commands
docker-build: ## Faz build da imagem Docker
	@echo '${GREEN}🐳 Fazendo build da imagem Docker...${RESET}'
	@docker build -t saraiva-whatsapp-api .

docker-up: ## Inicia containers Docker
	@echo '${GREEN}🐳 Iniciando containers...${RESET}'
	@docker-compose up -d
	@echo '${GREEN}✅ Containers iniciados${RESET}'
	@make docker-logs

docker-dev: ## Inicia containers em modo desenvolvimento
	@echo '${GREEN}🐳 Iniciando em modo desenvolvimento...${RESET}'
	@docker-compose -f docker-compose.dev.yml up

docker-down: ## Para containers Docker
	@echo '${YELLOW}🛑 Parando containers...${RESET}'
	@docker-compose down
	@echo '${GREEN}✅ Containers parados${RESET}'

docker-logs: ## Mostra logs dos containers
	@echo '${GREEN}📋 Logs dos containers:${RESET}'
	@docker-compose logs -f

docker-clean: ## Remove containers, volumes e imagens
	@echo '${YELLOW}🧹 Limpando Docker...${RESET}'
	@docker-compose down -v --rmi all
	@echo '${GREEN}✅ Limpeza Docker concluída${RESET}'

# Comandos de verificação
health: ## Verifica saúde da API
	@echo '${GREEN}❤️  Verificando saúde da API...${RESET}'
	@curl -s http://localhost:3333/health/detailed | json_pp || curl -s http://localhost:3333/health

health-basic: ## Healthcheck básico
	@curl -s http://localhost:3333/health

status: ## Mostra status da aplicação
	@echo '${GREEN}📊 Status da aplicação:${RESET}'
	@echo ''
	@echo 'Processos Node:'
	@ps aux | grep "node src/server.js" | grep -v grep || echo 'Nenhum processo rodando'
	@echo ''
	@echo 'Containers Docker:'
	@docker-compose ps 2>/dev/null || echo 'Docker Compose não está rodando'
	@echo ''
	@echo 'Porta 3333:'
	@lsof -i :3333 2>/dev/null || echo 'Porta 3333 livre'

# Comandos de utilidade
token: ## Gera um novo token seguro
	@echo '${GREEN}🔐 Token gerado:${RESET}'
	@openssl rand -hex 32 || node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

backup-sessions: ## Faz backup das sessões
	@echo '${GREEN}💾 Fazendo backup das sessões...${RESET}'
	@tar -czf sessions-backup-$$(date +%Y%m%d-%H%M%S).tar.gz sessions/
	@echo '${GREEN}✅ Backup criado${RESET}'

restore-sessions: ## Restaura backup de sessões (use: make restore-sessions FILE=backup.tar.gz)
	@echo '${YELLOW}📂 Restaurando sessões de ${FILE}...${RESET}'
	@tar -xzf ${FILE}
	@echo '${GREEN}✅ Sessões restauradas${RESET}'

# Quick commands
run: start ## Alias para start
serve: dev ## Alias para dev
up: docker-up ## Alias para docker-up
down: docker-down ## Alias para docker-down

# Default
.DEFAULT_GOAL := help
