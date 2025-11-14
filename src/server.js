const dotenv = require('dotenv');

// Carrega variáveis de ambiente
dotenv.config();

// Importa logger estruturado
const { logger } = require('./config/logger');

// Valida configurações de ambiente
const { validateEnvironment } = require('./config/env.validator');
validateEnvironment();

const app = require('./config/express');
const config = require('./config/config');
const { Session } = require('./api/class/session');

let server;
let isShuttingDown = false;

/**
 * Inicializa o servidor
 */
async function startServer() {
    try {
        server = app.listen(config.port, async () => {
            logger.info(`🚀 Servidor iniciado na porta ${config.port}`);
            logger.info(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
            logger.info(`🔒 Rotas protegidas: ${config.protectRoutes ? 'Sim' : 'Não'}`);

            if (config.restoreSessionsOnStartup) {
                logger.info('🔄 Restaurando sessões...');
                const session = new Session();
                await session.restoreSessions();
                logger.info('✅ Sessões restauradas com sucesso');
            }

            logger.info('✨ Servidor pronto para receber requisições!');
        });

        server.on('error', (error) => {
            logger.error('❌ Erro no servidor:', error);
            process.exit(1);
        });

    } catch (error) {
        logger.error('💥 Erro ao iniciar servidor:', error);
        process.exit(1);
    }
}

/**
 * Graceful Shutdown - Encerra conexões de forma limpa
 */
async function gracefulShutdown(signal) {
    if (isShuttingDown) {
        logger.warn('⚠️ Shutdown já em andamento...');
        return;
    }

    isShuttingDown = true;
    logger.info(`\n📴 ${signal} recebido, iniciando shutdown gracioso...`);

    // Define timeout para forçar shutdown
    const shutdownTimeout = setTimeout(() => {
        logger.error('⏰ Timeout de shutdown excedido, forçando encerramento');
        process.exit(1);
    }, 30000); // 30 segundos

    try {
        // Para de aceitar novas conexões
        if (server) {
            logger.info('🔌 Fechando servidor HTTP...');
            await new Promise((resolve) => {
                server.close(resolve);
            });
            logger.info('✅ Servidor HTTP fechado');
        }

        // Encerra sessões do WhatsApp
        logger.info('📱 Encerrando sessões do WhatsApp...');
        if (global.WhatsAppInstances) {
            const instances = Object.values(global.WhatsAppInstances);
            await Promise.all(
                instances.map(async (instance) => {
                    try {
                        if (instance.sock) {
                            await instance.sock.logout();
                        }
                    } catch (error) {
                        logger.warn(`⚠️ Erro ao encerrar instância: ${error.message}`);
                    }
                })
            );
            logger.info('✅ Sessões do WhatsApp encerradas');
        }

        // Limpa recursos
        logger.info('🧹 Limpando recursos...');
        clearTimeout(shutdownTimeout);

        logger.info('👋 Shutdown completo. Até logo!');
        process.exit(0);

    } catch (error) {
        logger.error('❌ Erro durante shutdown:', error);
        clearTimeout(shutdownTimeout);
        process.exit(1);
    }
}

/**
 * Handler de erros não tratados
 */
function unexpectedErrorHandler(error, origin) {
    logger.error({
        type: 'UNEXPECTED_ERROR',
        origin,
        error: {
            message: error.message,
            stack: error.stack,
            name: error.name,
        }
    }, `💥 Erro não tratado (${origin})`);

    // Em produção, tenta graceful shutdown
    if (process.env.NODE_ENV === 'production') {
        gracefulShutdown('ERROR');
    } else {
        process.exit(1);
    }
}

// Event listeners para shutdown
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Event listeners para erros
process.on('uncaughtException', (error) => unexpectedErrorHandler(error, 'uncaughtException'));
process.on('unhandledRejection', (error) => unexpectedErrorHandler(error, 'unhandledRejection'));

// Warning de memória
process.on('warning', (warning) => {
    logger.warn({
        type: 'NODE_WARNING',
        name: warning.name,
        message: warning.message,
        stack: warning.stack,
    }, '⚠️ Node.js warning');
});

// Inicia o servidor
startServer();

module.exports = server;
