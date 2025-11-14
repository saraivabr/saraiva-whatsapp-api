# 🚀 Quick Start - Saraiva WhatsApp API

Comece a usar a API em **menos de 5 minutos**!

---

## ⚡ Opção 1: Setup Automático (Recomendado)

```bash
# 1. Clone o repositório
git clone https://github.com/saraivabr/saraiva-whatsapp-api.git
cd saraiva-whatsapp-api

# 2. Execute o setup automático
chmod +x setup.sh
./setup.sh

# Pronto! O script vai:
# ✅ Verificar Node.js
# ✅ Criar .env com tokens seguros
# ✅ Instalar dependências
# ✅ Criar diretórios necessários
# ✅ Perguntar se quer iniciar o servidor
```

---

## 🐳 Opção 2: Docker (Mais Rápido)

```bash
# 1. Clone o repositório
git clone https://github.com/saraivabr/saraiva-whatsapp-api.git
cd saraiva-whatsapp-api

# 2. Copie .env
cp .env.example .env

# 3. Inicie com Docker
docker-compose up -d

# Pronto! API rodando em http://localhost:3333
```

---

## 📋 Opção 3: Manual

```bash
# 1. Clone
git clone https://github.com/saraivabr/saraiva-whatsapp-api.git
cd saraiva-whatsapp-api

# 2. Instale dependências
npm install

# 3. Configure .env
cp .env.example .env
# Edite .env e configure TOKEN e outros

# 4. Inicie
npm start
```

---

## ✅ Verificar se está Funcionando

```bash
# Teste rápido
curl http://localhost:3333/health

# Ou use o script de teste
node scripts/quick-test.js
```

---

## 📱 Primeiro Uso: Criar Instância WhatsApp

### 1. Criar instância

```bash
curl -X POST http://localhost:3333/instance/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "key": "minha-primeira-instancia",
    "webhook": "https://seu-webhook.com/eventos"
  }'
```

### 2. Obter QR Code

```bash
curl http://localhost:3333/instance/qr?key=minha-primeira-instancia \
  -H "Authorization: Bearer SEU_TOKEN"
```

Escaneie o QR Code com seu WhatsApp!

### 3. Enviar primeira mensagem

```bash
curl -X POST http://localhost:3333/message/text \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "key": "minha-primeira-instancia",
    "id": "5511999999999",
    "message": "Olá! Primeira mensagem via API 🚀"
  }'
```

---

## 🛠️ Comandos Úteis

### Com Makefile

```bash
make help           # Mostra todos comandos
make setup          # Setup completo
make start          # Inicia servidor
make dev            # Modo desenvolvimento
make docker-up      # Docker
make health         # Testa API
make token          # Gera token seguro
```

### Com NPM

```bash
npm start           # Produção
npm run dev         # Desenvolvimento
npm test            # Testes
npm run lint        # Verificar código
```

### Com Docker

```bash
docker-compose up -d              # Iniciar
docker-compose logs -f            # Logs
docker-compose down               # Parar
docker-compose -f docker-compose.dev.yml up  # Dev mode
```

---

## 📚 Próximos Passos

1. **Leia a documentação completa**: [README.md](README.md)
2. **Configure webhook**: Receba eventos em tempo real
3. **Explore endpoints**: Veja todos em `/health/detailed`
4. **Contribua**: [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 🆘 Problemas Comuns

### Porta 3333 já em uso?

```bash
# Altere a porta no .env
PORT=4000
```

### Token inválido?

```bash
# Gere um novo token
node scripts/generate-tokens.js
# Copie o TOKEN para seu .env
```

### API não responde?

```bash
# Teste se está rodando
make status

# Ou veja os logs
make logs

# Ou com Docker
docker-compose logs
```

---

## 💡 Dicas

- Use **modo desenvolvimento** (`npm run dev`) para hot-reload
- Configure **PROTECT_ROUTES=false** em desenvolvimento para não precisar de token
- Use **Docker** para evitar problemas de dependências
- Execute **make health** regularmente para verificar saúde da API

---

## 🎉 Pronto!

Você agora tem uma API WhatsApp rodando!

**Dúvidas?** Abra uma [issue](https://github.com/saraivabr/saraiva-whatsapp-api/issues)

**Funcionalidades:** Veja o [README completo](README.md)
