<div align="center">

# 🚀 Saraiva WhatsApp API

### API REST Multi-Device para WhatsApp

**Desenvolvida por [Saraiva.AI](https://saraiva.ai) - A maior livraria de inteligência artificial do Brasil**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](Dockerfile)

</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Características](#-características)
- [Requisitos](#-requisitos)
- [Instalação](#-instalação)
  - [Via NPM](#via-npm)
  - [Via Docker](#via-docker)
  - [Via Docker Compose](#via-docker-compose)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [Documentação da API](#-documentação-da-api)
- [Recursos Disponíveis](#-recursos-disponíveis)
- [Webhooks](#-webhooks)
- [Segurança](#-segurança)
- [Arquitetura](#-arquitetura)
- [Contribuindo](#-contribuindo)
- [Suporte](#-suporte)
- [Licença](#-licença)

---

## 🎯 Sobre o Projeto

A **Saraiva WhatsApp API** é uma implementação profissional e robusta baseada no [WhiskeySockets Baileys](https://github.com/WhiskeySockets/Baileys), oferecendo um serviço REST API completo para controlar todas as funções do WhatsApp de forma programática.

Esta solução permite criar:
- 💬 Sistemas de chat multi-atendimento
- 🤖 Bots inteligentes de atendimento
- 📊 Plataformas de CRM integradas
- 🔔 Sistemas de notificação em massa
- 📱 Aplicações que necessitem integração com WhatsApp

**Não é necessário conhecimento em Node.js!** Basta iniciar o servidor e fazer requisições na linguagem de sua preferência.

---

## ✨ Características

### 🔥 Principais Funcionalidades

- ✅ **Multi-Device**: Suporte completo ao protocolo multi-dispositivos do WhatsApp
- ✅ **Multi-Instância**: Gerencie múltiplas contas WhatsApp simultaneamente
- ✅ **Zero Banco de Dados**: Arquitetura leve sem dependência de banco de dados
- ✅ **API RESTful**: Interface moderna e padronizada
- ✅ **Webhooks**: Sistema completo de eventos em tempo real
- ✅ **Docker Ready**: Pronto para deploy em containers
- ✅ **Segurança**: Autenticação via token Bearer
- ✅ **Rate Limiting**: Proteção contra abuso de API
- ✅ **Logs Estruturados**: Sistema profissional de logging
- ✅ **Documentação Swagger**: API totalmente documentada

### 🎨 Conexão Flexível

- 📱 QR Code tradicional
- 🔐 Código de emparelhamento (pairing code)
- 🔄 Restauração automática de sessões

### 📦 Recursos de Envio

| Recurso | Status | Observações |
|---------|--------|-------------|
| Mensagens de texto | ✅ | Suporte completo |
| Imagens | ✅ | JPG, PNG, GIF |
| Vídeos | ✅ | Conversão automática para MP4 |
| Áudios | ✅ | Conversão para formato WhatsApp |
| Documentos | ✅ | PDF, DOC, XLS, etc |
| Localização | ✅ | Coordenadas GPS |
| Contatos | ✅ | VCard |
| Listas | ✅ | Lista de opções |
| Reações | ✅ | Emojis |
| Link Preview | ✅ | Prévia de links |
| Responder mensagens | ✅ | Reply/Quote |
| Presença | ✅ | Digitando, Gravando áudio |
| Buttons | ⏳ | Em desenvolvimento |
| Templates | ⏳ | Em desenvolvimento |

### 👥 Recursos de Grupos

- ✅ Criar grupos
- ✅ Adicionar/Remover participantes
- ✅ Promover/Rebaixar administradores
- ✅ Sair de grupos
- ✅ Entrar via convite
- ✅ Ghost mention (menção fantasma)
- ✅ Obter informações do grupo
- ✅ Configurações de grupo

---

## 📦 Requisitos

- **Node.js** 18.x ou superior
- **NPM** ou **Yarn**
- **FFmpeg** (para conversão de mídia - instalado automaticamente)
- **Docker** (opcional, para deploy em container)

---

## 🚀 Instalação

> 💡 **Dica:** Veja o [QUICK_START.md](QUICK_START.md) para começar em 5 minutos!

### ⚡ Setup Automático (Recomendado)

O jeito mais fácil de começar:

```bash
git clone https://github.com/saraivabr/saraiva-whatsapp-api.git
cd saraiva-whatsapp-api
npm run setup
```

O script interativo vai:
- ✅ Verificar requisitos (Node.js, npm)
- ✅ Gerar tokens seguros automaticamente
- ✅ Criar arquivo `.env` configurado
- ✅ Instalar todas as dependências
- ✅ Criar diretórios necessários
- ✅ Perguntar se quer iniciar o servidor

### Via NPM (Manual)

1. **Clone o repositório**

```bash
git clone https://github.com/saraivabr/saraiva-whatsapp-api.git
cd saraiva-whatsapp-api
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente**

```bash
cp .env.example .env
# Edite .env e configure seus tokens
# Ou gere tokens automaticamente: npm run generate-tokens
```

4. **Inicie o servidor**

```bash
# Produção
npm start

# Desenvolvimento (com hot-reload)
npm run dev
```

### Via Docker

1. **Build da imagem**

```bash
docker build -t saraiva-whatsapp-api .
```

2. **Execute o container**

```bash
docker run -p 3333:3333 \
  -e TOKEN=seu_token_aqui \
  -e PROTECT_ROUTES=true \
  -v $(pwd)/sessions:/app/sessions \
  saraiva-whatsapp-api
```

### Via Docker Compose

```bash
# Inicie todos os serviços
docker-compose up -d

# Visualize os logs
docker-compose logs -f

# Pare os serviços
docker-compose down
```

---

## ⚙️ Configuração

### Arquivo `.env`

```env
# ==================================
# CONFIGURAÇÃO DE SEGURANÇA
# ==================================
TOKEN=seu_token_super_secreto_aqui
PROTECT_ROUTES=true
ADMINTOKEN=token_admin_diferente
MAX_INSTANCES=50

# ==================================
# CONFIGURAÇÃO DA APLICAÇÃO
# ==================================
PORT=3333
APP_URL=http://localhost:3333
NODE_ENV=production
RESTORE_SESSIONS_ON_START_UP=true
LOG_LEVEL=info

# ==================================
# CONFIGURAÇÃO DE MÍDIA
# ==================================
# Não adicione espaços entre os mimetypes
videoMimeTypes=video/mp4,video/avi,video/mkv,video/quicktime
audioMimeTypes=audio/mp3,audio/wav,audio/ogg,audio/mpeg
documentMimeTypes=application/pdf,application/msword
imageMimeTypes=image/jpeg,image/png,image/gif

# Formato de saída de áudio (OGG ou MP3)
DEFAULT_AUDIO_OUTPUT=OGG

# ==================================
# CONFIGURAÇÃO DO MANAGER
# ==================================
USER=admin
PASSWORD=senha_segura_aqui
SESSION_SECRET=chave_secreta_sessao
COOKIE_SECRET=chave_secreta_cookie
```

### Variáveis Importantes

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `TOKEN` | Token de autenticação Bearer | - |
| `PROTECT_ROUTES` | Habilitar proteção de rotas | `true` |
| `PORT` | Porta do servidor | `3333` |
| `MAX_INSTANCES` | Máximo de instâncias simultâneas | `50` |
| `RESTORE_SESSIONS_ON_START_UP` | Restaurar sessões ao iniciar | `true` |
| `LOG_LEVEL` | Nível de log (silent, error, warn, info, debug) | `info` |

---

## 📖 Uso

### 1. Criar uma instância

```bash
POST /instance/create
Authorization: Bearer SEU_TOKEN

{
  "key": "minha-instancia",
  "webhook": "https://seu-webhook.com/eventos"
}
```

### 2. Obter QR Code

```bash
GET /instance/qr?key=minha-instancia
Authorization: Bearer SEU_TOKEN
```

### 3. Enviar mensagem de texto

```bash
POST /message/text
Authorization: Bearer SEU_TOKEN

{
  "key": "minha-instancia",
  "id": "5511999999999",
  "message": "Olá! Esta é uma mensagem via API."
}
```

### 4. Enviar imagem

```bash
POST /message/image
Authorization: Bearer SEU_TOKEN

{
  "key": "minha-instancia",
  "id": "5511999999999",
  "image": "https://exemplo.com/imagem.jpg",
  "caption": "Confira esta imagem!"
}
```

---

## 📚 Documentação da API

Acesse a documentação interativa Swagger em:

```
http://localhost:3333/api-docs
```

### Endpoints Principais

#### Instâncias
- `POST /instance/create` - Criar nova instância
- `GET /instance/qr` - Obter QR Code
- `GET /instance/qrbase64` - Obter QR Code em base64
- `POST /instance/logout` - Desconectar instância
- `DELETE /instance/delete` - Deletar instância
- `GET /instance/info` - Informações da instância

#### Mensagens
- `POST /message/text` - Enviar texto
- `POST /message/image` - Enviar imagem
- `POST /message/video` - Enviar vídeo
- `POST /message/audio` - Enviar áudio
- `POST /message/document` - Enviar documento
- `POST /message/location` - Enviar localização
- `POST /message/contact` - Enviar contato
- `POST /message/list` - Enviar lista
- `POST /message/reaction` - Enviar reação

#### Grupos
- `POST /group/create` - Criar grupo
- `POST /group/add` - Adicionar participante
- `POST /group/remove` - Remover participante
- `POST /group/promote` - Promover admin
- `POST /group/demote` - Rebaixar admin
- `POST /group/leave` - Sair do grupo
- `GET /group/info` - Informações do grupo

#### Diversos
- `GET /misc/contacts` - Listar contatos
- `GET /misc/chats` - Listar conversas
- `GET /status` - Status da API
- `GET /health` - Healthcheck

---

## 🔔 Webhooks

Configure um webhook na criação da instância para receber eventos em tempo real:

### Eventos Disponíveis

```javascript
{
  "event": "connection.update",
  "instance": "minha-instancia",
  "data": {
    "connection": "open",
    "qr": null
  }
}
```

#### Lista de Eventos

- `connection.update` - Atualização de conexão
- `qrCode.update` - Novo QR Code disponível
- `messages.upsert` - Nova mensagem recebida
- `messages.update` - Mensagem atualizada
- `presence.update` - Atualização de presença
- `contacts.upsert` - Contatos atualizados
- `chats.upsert` - Conversas atualizadas
- `chats.delete` - Conversa deletada
- `groups.upsert` - Grupo criado/atualizado
- `groups.update` - Informações de grupo atualizadas
- `group-participants.update` - Participantes atualizados
- `call.events` - Eventos de chamada

---

## 🔒 Segurança

### Autenticação

Todas as rotas são protegidas por autenticação Bearer Token quando `PROTECT_ROUTES=true`:

```bash
Authorization: Bearer SEU_TOKEN
```

### Rate Limiting

A API implementa rate limiting para prevenir abuso:
- **Geral**: 100 requisições por 15 minutos
- **Auth**: 5 tentativas por 15 minutos

### Boas Práticas

- ✅ Use HTTPS em produção
- ✅ Mantenha seus tokens em segredo
- ✅ Implemente validação de webhook
- ✅ Use variáveis de ambiente
- ✅ Atualize regularmente as dependências
- ✅ Monitore os logs de acesso

---

## 🏗️ Arquitetura

```
saraiva-whatsapp-api/
├── src/
│   ├── api/
│   │   ├── class/          # Classes principais (Session, Instance)
│   │   ├── controllers/    # Controladores de rotas
│   │   ├── middlewares/    # Middlewares (auth, error, rate-limit)
│   │   ├── routes/         # Definição de rotas
│   │   ├── models/         # Modelos de dados
│   │   ├── helpers/        # Funções auxiliares
│   │   └── errors/         # Tratamento de erros
│   ├── config/             # Configurações
│   ├── public/             # Arquivos estáticos
│   └── server.js           # Entry point
├── sessions/               # Dados de sessão (gitignored)
├── temp/                   # Arquivos temporários
├── tests/                  # Testes automatizados
├── .env.example            # Exemplo de variáveis de ambiente
├── docker-compose.yml      # Configuração Docker Compose
├── Dockerfile              # Imagem Docker
└── package.json            # Dependências
```

### Stack Tecnológico

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **WhatsApp**: @whiskeysockets/baileys
- **Logging**: Pino
- **Validação**: Express-validator
- **Segurança**: Helmet, CORS, express-rate-limit
- **Mídia**: FFmpeg, Sharp
- **Documentação**: Swagger/OpenAPI

---

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Veja como você pode ajudar:

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. **Commit** suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. **Push** para a branch (`git push origin feature/MinhaFeature`)
5. **Abra** um Pull Request

Leia nosso [Guia de Contribuição](CONTRIBUTING.md) para mais detalhes.

---

## 💡 Casos de Uso

- **E-commerce**: Notificações de pedidos e atendimento
- **Suporte**: Sistema de tickets via WhatsApp
- **Marketing**: Campanhas e newsletters
- **Automação**: Bots inteligentes com IA
- **Integração**: CRMs, ERPs e sistemas legados
- **Alertas**: Monitoramento e notificações críticas

---

## 📊 Performance

- **Consumo de memória**: ~50MB por instância
- **Latência**: <100ms em operações locais
- **Throughput**: 1000+ mensagens/minuto
- **Uptime**: 99.9% com configuração adequada

---

## 🐛 Problemas Conhecidos

Veja a lista de [Issues](https://github.com/saraivabr/saraiva-whatsapp-api/issues) para problemas conhecidos e solicitações de recursos.

---

## 📞 Suporte

### Desenvolvido por Saraiva.AI

- 🌐 **Website**: [https://saraiva.ai](https://saraiva.ai)
- 📧 **Email**: fellipesaraivabarbosa@gmail.com
- 💼 **LinkedIn**: [Fellipe Saraiva](https://linkedin.com/in/fellipesaraiva)
- 🐙 **GitHub**: [@saraivabr](https://github.com/saraivabr)

### Comunidade

- 💬 Dúvidas? Abra uma [Issue](https://github.com/saraivabr/saraiva-whatsapp-api/issues)
- 🐛 Encontrou um bug? [Reporte aqui](https://github.com/saraivabr/saraiva-whatsapp-api/issues/new)
- 💡 Sugestões? Adoramos feedback!

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🙏 Agradecimentos

Este projeto foi inspirado e construído sobre o trabalho de:

- [WhiskeySockets/Baileys](https://github.com/WhiskeySockets/Baileys) - Biblioteca base para WhatsApp
- [salman0ansari/whatsapp-api-nodejs](https://github.com/salman0ansari/whatsapp-api-nodejs) - Projeto original
- Toda a comunidade open source

---

## 🌟 Estrelas

Se este projeto foi útil para você, considere dar uma ⭐!

---

<div align="center">

**Desenvolvido com ❤️ pela [Saraiva.AI](https://saraiva.ai)**

*Transformando a comunicação através da tecnologia*

</div>
