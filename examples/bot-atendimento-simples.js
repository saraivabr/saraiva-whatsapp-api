/**
 * BOT DE ATENDIMENTO AUTOMÁTICO SIMPLES
 *
 * Caso de uso: Atendimento 24/7 com respostas automáticas
 * Ideal para: Pequenos negócios, delivery, agendamentos
 */

const axios = require('axios');

// Configuração
const API_URL = 'http://localhost:3333';
const TOKEN = 'SEU_TOKEN_AQUI';
const INSTANCE_KEY = 'meu-bot-atendimento';

// Headers padrão
const headers = {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json'
};

// Base de conhecimento do bot
const RESPOSTAS = {
    'ola': 'Olá! 👋 Bem-vindo à *Saraiva.AI*!\n\nComo posso ajudar você hoje?\n\n1️⃣ Ver produtos\n2️⃣ Fazer pedido\n3️⃣ Horário de funcionamento\n4️⃣ Localização\n5️⃣ Falar com atendente',

    'horario': '🕐 *Horário de Funcionamento*\n\nSeg a Sex: 9h às 18h\nSábado: 9h às 13h\nDomingo: Fechado',

    'localizacao': '📍 *Nossa Localização*\n\nRua das Flores, 123\nCentro - São Paulo/SP\nCEP: 01234-567\n\n🗺️ https://maps.google.com/?q=-23.550520,-46.633308',

    'produtos': '🛍️ *Nossos Produtos*\n\n✨ IA Generativa\n📚 Cursos de Python\n🤖 Automação com ChatGPT\n💡 Consultoria em IA\n\nQuer saber mais sobre algum? Digite o número!',

    'pedido': '📦 *Fazer Pedido*\n\nPara fazer um pedido:\n1. Escolha o produto\n2. Informe a quantidade\n3. Confirme o endereço\n\nNosso atendente vai te ajudar!\nDigite *ATENDENTE* para falar com alguém.',

    'atendente': '🙋‍♂️ Aguarde, vou transferir você para um atendente humano!\n\nEm breve alguém da equipe vai te responder.',

    'default': 'Desculpe, não entendi. 😅\n\nDigite *MENU* para ver as opções disponíveis!'
};

// Palavras-chave para detecção de intenção
const PALAVRAS_CHAVE = {
    'ola': ['ola', 'oi', 'olá', 'hey', 'bom dia', 'boa tarde', 'boa noite', 'menu'],
    'horario': ['horario', 'horário', 'funciona', 'abre', 'fecha', 'aberto'],
    'localizacao': ['localização', 'localizacao', 'endereço', 'endereco', 'onde', 'local'],
    'produtos': ['produtos', 'produto', 'vender', 'comprar', 'catalogo', 'catálogo'],
    'pedido': ['pedido', 'pedir', 'quero', 'encomendar', 'comprar'],
    'atendente': ['atendente', 'humano', 'pessoa', 'ajuda', 'suporte']
};

/**
 * Detecta a intenção da mensagem
 */
function detectarIntencao(mensagem) {
    const msgLower = mensagem.toLowerCase();

    for (const [intencao, palavras] of Object.entries(PALAVRAS_CHAVE)) {
        if (palavras.some(palavra => msgLower.includes(palavra))) {
            return intencao;
        }
    }

    return 'default';
}

/**
 * Envia mensagem de resposta
 */
async function enviarMensagem(numeroDestino, mensagem) {
    try {
        const response = await axios.post(`${API_URL}/message/text`, {
            key: INSTANCE_KEY,
            id: numeroDestino,
            message: mensagem
        }, { headers });

        console.log('✅ Mensagem enviada para:', numeroDestino);
        return response.data;
    } catch (error) {
        console.error('❌ Erro ao enviar mensagem:', error.message);
        throw error;
    }
}

/**
 * Processa mensagem recebida
 */
async function processarMensagem(data) {
    try {
        // Extrai dados da mensagem
        const mensagem = data.message?.conversation ||
                        data.message?.extendedTextMessage?.text || '';
        const remetente = data.key.remoteJid;
        const ehGrupo = remetente.includes('@g.us');

        // Ignora mensagens de grupo
        if (ehGrupo) return;

        // Ignora mensagens enviadas por nós mesmos
        if (data.key.fromMe) return;

        console.log(`📨 Mensagem recebida de ${remetente}: ${mensagem}`);

        // Detecta intenção
        const intencao = detectarIntencao(mensagem);
        const resposta = RESPOSTAS[intencao];

        // Envia resposta
        await enviarMensagem(remetente, resposta);

        // Se for atendente, notifica equipe (implementar webhook)
        if (intencao === 'atendente') {
            console.log(`🚨 Cliente ${remetente} solicitou atendente!`);
            // Aqui você pode integrar com seu sistema de tickets
        }

    } catch (error) {
        console.error('❌ Erro ao processar mensagem:', error);
    }
}

/**
 * Configura webhook (simulação via polling - use webhook real em produção)
 */
async function iniciarBot() {
    console.log('🤖 Bot de Atendimento Saraiva.AI iniciado!');
    console.log(`📱 Instância: ${INSTANCE_KEY}`);
    console.log('🔄 Aguardando mensagens...\n');

    // Em produção, use webhook real configurado na criação da instância
    // Este é apenas um exemplo educacional
    console.log('💡 IMPORTANTE: Configure um webhook real para produção!');
    console.log(`   POST ${API_URL}/instance/create`);
    console.log(`   { "key": "${INSTANCE_KEY}", "webhook": "https://seu-servidor/webhook" }`);
}

/**
 * Exemplo de endpoint webhook (Express)
 */
function exemploWebhookExpress() {
    /*
    const express = require('express');
    const app = express();

    app.use(express.json());

    app.post('/webhook', async (req, res) => {
        const { event, data } = req.body;

        // Processa apenas mensagens novas
        if (event === 'messages.upsert') {
            for (const msg of data) {
                await processarMensagem(msg);
            }
        }

        res.sendStatus(200);
    });

    app.listen(3000, () => {
        console.log('🎣 Webhook rodando na porta 3000');
    });
    */
}

// Inicia o bot
iniciarBot();

// Exporta funções para uso
module.exports = {
    processarMensagem,
    enviarMensagem,
    detectarIntencao
};
