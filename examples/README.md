# 📚 Exemplos Práticos - Saraiva WhatsApp API

Soluções prontas para usar em casos reais de negócio.

---

## 🤖 1. Bot de Atendimento Automático

**Arquivo:** `bot-atendimento-simples.js`

### O que faz:
- Responde automaticamente 24/7
- Detecta intenções do cliente
- Menu interativo
- Transfere para atendente humano quando necessário

### Casos de uso:
- ✅ Delivery e restaurantes
- ✅ Clínicas e consultórios (agendamentos)
- ✅ Lojas online (FAQ)
- ✅ Suporte técnico nível 1

### Como usar:
```bash
cd examples
npm install axios
node bot-atendimento-simples.js
```

### Personalização:
Edite o objeto `RESPOSTAS` para suas necessidades:
```javascript
const RESPOSTAS = {
    'ola': 'Sua mensagem de boas-vindas aqui',
    'horario': 'Seu horário de funcionamento',
    // ... adicione mais
};
```

---

## 📢 2. Envio em Massa para Campanhas

**Arquivo:** `envio-massa-campanha.js`

### O que faz:
- Envia mensagens personalizadas em lote
- Controle de velocidade (evita ban)
- Suporta imagens
- Relatório detalhado de envios
- Carrega contatos de CSV

### Casos de uso:
- ✅ Campanhas de marketing
- ✅ Promoções e ofertas
- ✅ Lembretes de consultas/eventos
- ✅ Comunicados importantes

### Como usar:
```javascript
const { executarCampanha } = require('./envio-massa-campanha');

await executarCampanha({
    nomeCampanha: 'black-friday-2024',
    contatos: [
        { numero: '5511999999999', nome: 'João' },
        // ... mais contatos
    ],
    mensagem: 'Olá {nome}! Sua mensagem aqui',
    imagemUrl: 'https://link-da-imagem.jpg' // opcional
});
```

### Carregar de CSV:
```javascript
const { carregarContatosCSV } = require('./envio-massa-campanha');
const contatos = carregarContatosCSV('contatos.csv');
```

Formato do CSV:
```csv
nome,numero
João Silva,5511999999999
Maria Santos,5511888888888
```

---

## 🛒 3. Integração com E-commerce

**Arquivo:** `integracao-ecommerce.js`

### O que faz:
- Notificações automáticas de pedidos
- Confirmação de pagamento
- Rastreamento de envio
- Recuperação de carrinho abandonado
- Pedido de avaliação pós-venda

### Casos de uso:
- ✅ WooCommerce / Shopify
- ✅ Mercado Livre
- ✅ Qualquer plataforma com webhook

### Fluxo completo:
```
Novo Pedido → Pagamento Confirmado → Pedido Enviado → Entregue → Avaliação
     ↓              ↓                       ↓              ↓          ↓
  WhatsApp      WhatsApp               WhatsApp      WhatsApp   WhatsApp
```

### Como usar:

#### Notificar novo pedido:
```javascript
const { notificarNovoPedido } = require('./integracao-ecommerce');

await notificarNovoPedido({
    cliente: { nome: 'João Silva' },
    numeroPedido: '12345',
    itens: [
        { nome: 'Produto X', quantidade: 2, preco: '50.00' }
    ],
    total: 100.00,
    telefone: '5511999999999'
});
```

#### Webhook WooCommerce:
```javascript
const { criarWebhookWooCommerce } = require('./integracao-ecommerce');
criarWebhookWooCommerce();
```

Configure no WooCommerce:
- URL: `http://seu-servidor:3001/webhook/pedido-criado`
- Evento: `Order created`

---

## 🎯 Outros Exemplos Disponíveis

### 4. Agendamento de Consultas
**EM BREVE**
- Agenda horários automaticamente
- Envia lembretes
- Confirmações

### 5. Chatbot com IA (ChatGPT)
**EM BREVE**
- Integra com OpenAI
- Respostas inteligentes
- Contextualização

### 6. Sistema de Tickets
**EM BREVE**
- Suporte organizado
- Filas de atendimento
- Histórico completo

---

## 💡 Dicas Importantes

### Evitar Ban do WhatsApp

1. **Respeite limites**:
   - Máximo 20-30 mensagens por minuto
   - Use delay de 3-5 segundos entre mensagens
   - Divida envios grandes em lotes

2. **Mensagens de qualidade**:
   - Personalize sempre que possível
   - Evite spam
   - Permita opt-out

3. **Boas práticas**:
   - Use apenas com contatos autorizados
   - Não envie para números aleatórios
   - Respeite horários comerciais

### Webhook vs Polling

**Use Webhook (recomendado):**
```javascript
// Configure ao criar instância
{
    "key": "minha-instancia",
    "webhook": "https://seu-servidor.com/webhook"
}
```

**Evite Polling:**
- Menos eficiente
- Atraso nas respostas
- Maior uso de recursos

### Personalização de Mensagens

```javascript
// Ruim ❌
"Olá! Temos uma oferta"

// Bom ✅
"Olá João! Temos uma oferta especial para VOCÊ"
```

Use variáveis:
- `{nome}` - Nome do cliente
- `{pedido}` - Número do pedido
- `{valor}` - Valor customizado

---

## 🚀 Começar Agora

1. **Clone este repositório**
2. **Escolha um exemplo**
3. **Configure suas credenciais**
4. **Execute e teste**
5. **Adapte para seu negócio**

---

## 📞 Suporte

Dúvidas sobre os exemplos?

- 📧 Email: fellipesaraivabarbosa@gmail.com
- 💬 Issues: [GitHub](https://github.com/saraivabr/saraiva-whatsapp-api/issues)
- 📖 Docs: [README.md](../README.md)

---

## 🎁 Contribua

Tem um exemplo interessante? Compartilhe!

1. Fork o projeto
2. Crie seu exemplo
3. Abra um Pull Request

Vamos construir juntos! 🤝
