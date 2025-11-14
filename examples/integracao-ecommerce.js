/**
 * INTEGRAÇÃO COM E-COMMERCE
 *
 * Caso de uso: Notificações automáticas de pedidos
 * Integra com: WooCommerce, Shopify, Mercado Livre, etc
 */

const axios = require('axios');
const express = require('express');

// Configuração
const API_URL = 'http://localhost:3333';
const TOKEN = 'SEU_TOKEN_AQUI';
const INSTANCE_KEY = 'ecommerce-notificacoes';

const headers = {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json'
};

/**
 * Envia notificação de novo pedido
 */
async function notificarNovoPedido(pedido) {
    const { cliente, numeroPedido, itens, total, telefone } = pedido;

    const mensagem = `🛒 *Novo Pedido Recebido!*

Olá ${cliente.nome}! 👋

Recebemos seu pedido com sucesso:

🔖 *Pedido:* #${numeroPedido}
💰 *Valor Total:* R$ ${total.toFixed(2)}

📦 *Itens:*
${itens.map(item => `  • ${item.quantidade}x ${item.nome} - R$ ${item.preco}`).join('\n')}

✅ *Status:* Aguardando Pagamento

Você receberá atualizações em tempo real por aqui!

Dúvidas? Responda esta mensagem! 😊`;

    return await enviarMensagem(telefone, mensagem);
}

/**
 * Notifica pagamento confirmado
 */
async function notificarPagamentoConfirmado(pedido) {
    const { cliente, numeroPedido, telefone, metodoPagamento } = pedido;

    const mensagem = `✅ *Pagamento Confirmado!*

${cliente.nome}, seu pagamento foi aprovado! 🎉

🔖 *Pedido:* #${numeroPedido}
💳 *Método:* ${metodoPagamento}

📦 Estamos preparando seu pedido para envio.
🚚 Em breve você receberá o código de rastreamento.

Obrigado pela confiança! ❤️`;

    return await enviarMensagem(telefone, mensagem);
}

/**
 * Notifica envio do pedido
 */
async function notificarEnvioPedido(pedido) {
    const { cliente, numeroPedido, telefone, codigoRastreio, transportadora, previsaoEntrega } = pedido;

    const mensagem = `📦 *Pedido Enviado!*

${cliente.nome}, seu pedido já está a caminho! 🚚

🔖 *Pedido:* #${numeroPedido}
🏢 *Transportadora:* ${transportadora}
📍 *Rastreio:* ${codigoRastreio}
📅 *Previsão:* ${previsaoEntrega}

🔗 Rastreie seu pedido:
https://rastreamento.correios.com.br/${codigoRastreio}

Aguardamos você! 😊`;

    return await enviarMensagem(telefone, mensagem);
}

/**
 * Notifica pedido entregue
 */
async function notificarPedidoEntregue(pedido) {
    const { cliente, numeroPedido, telefone } = pedido;

    const mensagem = `✅ *Pedido Entregue!*

${cliente.nome}, seu pedido foi entregue! 🎁

🔖 *Pedido:* #${numeroPedido}

Esperamos que goste! ❤️

⭐ Que tal avaliar sua experiência?
https://saraiva.ai/avaliar/${numeroPedido}

Sua opinião é muito importante para nós! 🙏`;

    return await enviarMensagem(telefone, mensagem);
}

/**
 * Envia mensagem genérica
 */
async function enviarMensagem(numero, mensagem) {
    try {
        const response = await axios.post(`${API_URL}/message/text`, {
            key: INSTANCE_KEY,
            id: numero,
            message: mensagem
        }, { headers });

        console.log(`✅ Notificação enviada para ${numero}`);
        return { sucesso: true, data: response.data };
    } catch (error) {
        console.error(`❌ Erro ao enviar para ${numero}:`, error.message);
        return { sucesso: false, erro: error.message };
    }
}

/**
 * Carrinho abandonado - Recuperação
 */
async function notificarCarrinhoAbandonado(cliente, carrinho) {
    const { nome, telefone } = cliente;
    const { itens, total } = carrinho;

    const mensagem = `🛒 *Você esqueceu algo!*

Olá ${nome}! 😊

Percebemos que você deixou itens no carrinho:

${itens.map(item => `  • ${item.nome} - R$ ${item.preco}`).join('\n')}

💰 *Total:* R$ ${total.toFixed(2)}

🎁 *BOA NOTÍCIA:* Temos um desconto especial de *10% OFF* esperando por você!

🛍️ Finalizar compra:
https://saraiva.ai/checkout/${carrinho.id}

Oferta válida por 24h! ⏰`;

    return await enviarMensagem(telefone, mensagem);
}

/**
 * Webhook para integração com WooCommerce
 */
function criarWebhookWooCommerce() {
    const app = express();
    app.use(express.json());

    // Webhook: Novo pedido
    app.post('/webhook/pedido-criado', async (req, res) => {
        const pedido = {
            cliente: {
                nome: req.body.billing.first_name,
            },
            numeroPedido: req.body.id,
            itens: req.body.line_items.map(item => ({
                nome: item.name,
                quantidade: item.quantity,
                preco: item.price
            })),
            total: parseFloat(req.body.total),
            telefone: req.body.billing.phone
        };

        await notificarNovoPedido(pedido);
        res.sendStatus(200);
    });

    // Webhook: Pagamento confirmado
    app.post('/webhook/pagamento-confirmado', async (req, res) => {
        const pedido = {
            cliente: { nome: req.body.billing.first_name },
            numeroPedido: req.body.id,
            telefone: req.body.billing.phone,
            metodoPagamento: req.body.payment_method_title
        };

        await notificarPagamentoConfirmado(pedido);
        res.sendStatus(200);
    });

    // Webhook: Pedido enviado
    app.post('/webhook/pedido-enviado', async (req, res) => {
        const pedido = {
            cliente: { nome: req.body.billing.first_name },
            numeroPedido: req.body.id,
            telefone: req.body.billing.phone,
            codigoRastreio: req.body.meta_data.find(m => m.key === 'tracking_code')?.value,
            transportadora: req.body.meta_data.find(m => m.key === 'shipping_company')?.value || 'Correios',
            previsaoEntrega: '3-5 dias úteis'
        };

        await notificarEnvioPedido(pedido);
        res.sendStatus(200);
    });

    app.listen(3001, () => {
        console.log('🎣 Webhook WooCommerce rodando na porta 3001');
    });
}

/**
 * Sistema de notificações programadas
 */
async function agendarNotificacoes(pedido) {
    // 2 horas após pedido - lembrete de pagamento
    setTimeout(async () => {
        if (pedido.status === 'aguardando_pagamento') {
            const mensagem = `⏰ *Lembrete de Pagamento*

Olá ${pedido.cliente.nome}!

Seu pedido #${pedido.numeroPedido} está aguardando pagamento.

💳 Complete o pagamento para garantir sua compra!
🔗 ${pedido.linkPagamento}

Precisa de ajuda? Responda esta mensagem! 😊`;

            await enviarMensagem(pedido.telefone, mensagem);
        }
    }, 2 * 60 * 60 * 1000); // 2 horas

    // 7 dias após entrega - pedido de avaliação
    setTimeout(async () => {
        if (pedido.status === 'entregue') {
            const mensagem = `⭐ *Como foi sua experiência?*

Olá ${pedido.cliente.nome}!

Já faz uma semana que você recebeu seu pedido #${pedido.numeroPedido}.

Nos ajude a melhorar! ❤️

✨ Avalie sua compra:
https://saraiva.ai/avaliar/${pedido.numeroPedido}

Leva só 1 minuto! 🙏`;

            await enviarMensagem(pedido.telefone, mensagem);
        }
    }, 7 * 24 * 60 * 60 * 1000); // 7 dias
}

/**
 * EXEMPLO DE USO
 */
async function exemploCompleto() {
    const pedidoExemplo = {
        cliente: {
            nome: 'Maria Silva',
        },
        numeroPedido: '12345',
        itens: [
            { nome: 'Curso Python para IA', quantidade: 1, preco: '197.00' },
            { nome: 'E-book ChatGPT', quantidade: 1, preco: '47.00' }
        ],
        total: 244.00,
        telefone: '5511999999999',
        metodoPagamento: 'Pix',
        status: 'novo'
    };

    // Notifica novo pedido
    await notificarNovoPedido(pedidoExemplo);

    // Simula confirmação de pagamento
    setTimeout(() => {
        pedidoExemplo.status = 'pago';
        notificarPagamentoConfirmado(pedidoExemplo);
    }, 5000);
}

module.exports = {
    notificarNovoPedido,
    notificarPagamentoConfirmado,
    notificarEnvioPedido,
    notificarPedidoEntregue,
    notificarCarrinhoAbandonado,
    criarWebhookWooCommerce,
    agendarNotificacoes
};
