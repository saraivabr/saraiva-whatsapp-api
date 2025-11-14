/**
 * SISTEMA DE ENVIO EM MASSA PARA CAMPANHAS
 *
 * Caso de uso: Marketing, avisos, promoções
 * Features: Delay entre envios, personalização, tracking
 */

const axios = require('axios');
const fs = require('fs');

// Configuração
const API_URL = 'http://localhost:3333';
const TOKEN = 'SEU_TOKEN_AQUI';
const INSTANCE_KEY = 'campanha-marketing';

const headers = {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json'
};

// Delay entre mensagens (evita ban)
const DELAY_ENTRE_MENSAGENS = 3000; // 3 segundos
const DELAY_ENTRE_LOTES = 30000; // 30 segundos
const TAMANHO_LOTE = 20; // 20 mensagens por lote

/**
 * Aguarda um tempo específico
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Envia mensagem personalizada
 */
async function enviarMensagem(numero, nome, mensagem) {
    try {
        // Personaliza mensagem com nome
        const mensagemPersonalizada = mensagem.replace('{nome}', nome);

        const response = await axios.post(`${API_URL}/message/text`, {
            key: INSTANCE_KEY,
            id: numero,
            message: mensagemPersonalizada
        }, { headers });

        return {
            sucesso: true,
            numero,
            nome,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        return {
            sucesso: false,
            numero,
            nome,
            erro: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * Envia mensagem com imagem
 */
async function enviarMensagemComImagem(numero, nome, mensagem, imagemUrl) {
    try {
        const mensagemPersonalizada = mensagem.replace('{nome}', nome);

        const response = await axios.post(`${API_URL}/message/image`, {
            key: INSTANCE_KEY,
            id: numero,
            image: imagemUrl,
            caption: mensagemPersonalizada
        }, { headers });

        return {
            sucesso: true,
            numero,
            nome,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        return {
            sucesso: false,
            numero,
            nome,
            erro: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * Processa campanha em lotes
 */
async function executarCampanha(config) {
    const { contatos, mensagem, imagemUrl = null, nomeCampanha } = config;

    console.log('\n🚀 INICIANDO CAMPANHA DE ENVIO EM MASSA');
    console.log('═'.repeat(60));
    console.log(`📊 Campanha: ${nomeCampanha}`);
    console.log(`👥 Total de contatos: ${contatos.length}`);
    console.log(`📦 Tamanho do lote: ${TAMANHO_LOTE}`);
    console.log(`⏱️  Delay entre mensagens: ${DELAY_ENTRE_MENSAGENS}ms`);
    console.log(`⏱️  Delay entre lotes: ${DELAY_ENTRE_LOTES}ms`);
    console.log('═'.repeat(60));
    console.log('');

    const resultados = {
        total: contatos.length,
        enviados: 0,
        falhas: 0,
        detalhes: []
    };

    // Divide em lotes
    for (let i = 0; i < contatos.length; i += TAMANHO_LOTE) {
        const lote = contatos.slice(i, i + TAMANHO_LOTE);
        const numeroLote = Math.floor(i / TAMANHO_LOTE) + 1;

        console.log(`📦 Processando lote ${numeroLote}/${Math.ceil(contatos.length / TAMANHO_LOTE)}...`);

        // Processa cada contato do lote
        for (const contato of lote) {
            const { numero, nome } = contato;

            let resultado;
            if (imagemUrl) {
                resultado = await enviarMensagemComImagem(numero, nome, mensagem, imagemUrl);
            } else {
                resultado = await enviarMensagem(numero, nome, mensagem);
            }

            resultados.detalhes.push(resultado);

            if (resultado.sucesso) {
                resultados.enviados++;
                console.log(`   ✅ ${nome} (${numero})`);
            } else {
                resultados.falhas++;
                console.log(`   ❌ ${nome} (${numero}) - ${resultado.erro}`);
            }

            // Delay entre mensagens
            await sleep(DELAY_ENTRE_MENSAGENS);
        }

        // Delay entre lotes (exceto no último)
        if (i + TAMANHO_LOTE < contatos.length) {
            console.log(`⏸️  Aguardando ${DELAY_ENTRE_LOTES/1000}s antes do próximo lote...\n`);
            await sleep(DELAY_ENTRE_LOTES);
        }
    }

    // Relatório final
    console.log('\n═'.repeat(60));
    console.log('📊 RELATÓRIO FINAL DA CAMPANHA');
    console.log('═'.repeat(60));
    console.log(`✅ Enviados com sucesso: ${resultados.enviados}/${resultados.total}`);
    console.log(`❌ Falhas: ${resultados.falhas}/${resultados.total}`);
    console.log(`📈 Taxa de sucesso: ${((resultados.enviados/resultados.total)*100).toFixed(2)}%`);
    console.log('═'.repeat(60));

    // Salva relatório em arquivo
    const nomeArquivo = `relatorio-${nomeCampanha}-${Date.now()}.json`;
    fs.writeFileSync(nomeArquivo, JSON.stringify(resultados, null, 2));
    console.log(`💾 Relatório salvo em: ${nomeArquivo}\n`);

    return resultados;
}

/**
 * EXEMPLO DE USO
 */
async function exemploCampanhaPromocao() {
    const campanha = {
        nomeCampanha: 'black-friday-2024',

        // Lista de contatos (pode vir de CSV, banco de dados, etc)
        contatos: [
            { numero: '5511999999991', nome: 'João Silva' },
            { numero: '5511999999992', nome: 'Maria Santos' },
            { numero: '5511999999993', nome: 'Pedro Oliveira' },
            // ... mais contatos
        ],

        // Mensagem (use {nome} para personalizar)
        mensagem: `🔥 *BLACK FRIDAY SARAIVA.AI* 🔥

Olá {nome}!

Preparamos uma oferta EXCLUSIVA para você:

💰 *50% OFF* em todos os cursos de IA
🎁 *E-book GRÁTIS* de Python
⚡ Válido só hoje!

🛒 Acesse: https://saraiva.ai/blackfriday

Não perca! ⏰`,

        // Imagem da campanha (opcional)
        imagemUrl: 'https://saraiva.ai/images/black-friday-banner.jpg'
    };

    await executarCampanha(campanha);
}

/**
 * Carrega contatos de arquivo CSV
 */
function carregarContatosCSV(caminhoArquivo) {
    const csv = fs.readFileSync(caminhoArquivo, 'utf-8');
    const linhas = csv.split('\n');
    const contatos = [];

    // Pula cabeçalho
    for (let i = 1; i < linhas.length; i++) {
        const [nome, numero] = linhas[i].split(',');
        if (nome && numero) {
            contatos.push({
                nome: nome.trim(),
                numero: numero.trim()
            });
        }
    }

    return contatos;
}

/**
 * Template: Lembrete de Consulta
 */
function templateLembreteConsulta(nome, data, hora, local) {
    return `📅 *Lembrete de Consulta*

Olá ${nome}!

Este é um lembrete da sua consulta:

🗓️ Data: ${data}
🕐 Horário: ${hora}
📍 Local: ${local}

Por favor, chegue com 15 minutos de antecedência.

Para cancelar ou reagendar, responda esta mensagem.

Até breve! 😊`;
}

/**
 * Template: Confirmação de Pedido
 */
function templateConfirmacaoPedido(nome, numeroPedido, valor, itens) {
    return `✅ *Pedido Confirmado!*

Olá ${nome}!

Seu pedido foi confirmado com sucesso:

🔖 Número: #${numeroPedido}
💰 Valor: R$ ${valor}

📦 Itens:
${itens}

🚚 Previsão de entrega: 3-5 dias úteis

Acompanhe seu pedido em:
https://saraiva.ai/pedidos/${numeroPedido}

Obrigado pela preferência! 🎉`;
}

// Exemplo de uso
if (require.main === module) {
    console.log('💡 Para executar a campanha, descomente a linha abaixo:');
    // exemploCampanhaPromocao();
}

module.exports = {
    executarCampanha,
    enviarMensagem,
    enviarMensagemComImagem,
    carregarContatosCSV,
    templateLembreteConsulta,
    templateConfirmacaoPedido
};
