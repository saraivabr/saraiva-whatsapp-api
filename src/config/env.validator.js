/**
 * Validador de Variáveis de Ambiente
 * Garante que todas as configurações necessárias estejam presentes e válidas
 */

const logger = require('pino')();

/**
 * Valida uma variável obrigatória
 */
function validateRequired(name, value, type = 'string') {
    if (!value) {
        throw new Error(`❌ Variável de ambiente obrigatória não configurada: ${name}`);
    }

    if (type === 'number' && isNaN(Number(value))) {
        throw new Error(`❌ Variável ${name} deve ser um número válido`);
    }

    if (type === 'boolean' && !['true', 'false'].includes(String(value).toLowerCase())) {
        throw new Error(`❌ Variável ${name} deve ser 'true' ou 'false'`);
    }

    return value;
}

/**
 * Valida uma variável opcional com valor padrão
 */
function validateOptional(name, value, defaultValue, type = 'string') {
    if (!value) {
        logger.info(`ℹ️  Usando valor padrão para ${name}: ${defaultValue}`);
        return defaultValue;
    }

    if (type === 'number' && isNaN(Number(value))) {
        logger.warn(`⚠️  Valor inválido para ${name}, usando padrão: ${defaultValue}`);
        return defaultValue;
    }

    return value;
}

/**
 * Valida porta
 */
function validatePort(port) {
    const portNum = Number(port);
    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
        throw new Error(`❌ Porta inválida: ${port}. Deve estar entre 1 e 65535`);
    }
    return portNum;
}

/**
 * Valida nível de log
 */
function validateLogLevel(level) {
    const validLevels = ['silent', 'fatal', 'error', 'warn', 'info', 'debug', 'trace'];
    if (!validLevels.includes(level)) {
        logger.warn(`⚠️  Nível de log inválido: ${level}. Usando 'info'`);
        return 'info';
    }
    return level;
}

/**
 * Valida configuração de ambiente
 */
function validateEnvironment() {
    logger.info('🔍 Validando configurações de ambiente...');

    try {
        // Validações de segurança
        if (process.env.PROTECT_ROUTES === 'true') {
            if (!process.env.TOKEN || process.env.TOKEN.length < 20) {
                throw new Error('❌ TOKEN deve ter pelo menos 20 caracteres quando PROTECT_ROUTES=true');
            }
        }

        // Validações de produção
        if (process.env.NODE_ENV === 'production') {
            if (!process.env.TOKEN || process.env.TOKEN === 'YOUR_TOKEN') {
                throw new Error('❌ Em produção, você DEVE configurar um TOKEN seguro');
            }

            if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
                throw new Error('❌ SESSION_SECRET deve ter pelo menos 32 caracteres em produção');
            }

            if (!process.env.COOKIE_SECRET || process.env.COOKIE_SECRET.length < 32) {
                throw new Error('❌ COOKIE_SECRET deve ter pelo menos 32 caracteres em produção');
            }
        }

        // Validação de porta
        validatePort(process.env.PORT || 3333);

        // Validação de MAX_INSTANCES
        const maxInstances = Number(process.env.MAX_INSTANCES || 50);
        if (maxInstances < 1 || maxInstances > 1000) {
            logger.warn('⚠️  MAX_INSTANCES deve estar entre 1 e 1000. Usando 50');
        }

        logger.info('✅ Configurações de ambiente validadas com sucesso!');

        // Log de resumo
        logger.info('📋 Resumo da configuração:');
        logger.info(`   - Ambiente: ${process.env.NODE_ENV || 'development'}`);
        logger.info(`   - Porta: ${process.env.PORT || 3333}`);
        logger.info(`   - Rotas Protegidas: ${process.env.PROTECT_ROUTES === 'true' ? 'Sim' : 'Não'}`);
        logger.info(`   - Restaurar Sessões: ${process.env.RESTORE_SESSIONS_ON_START_UP === 'true' ? 'Sim' : 'Não'}`);
        logger.info(`   - Log Level: ${process.env.LOG_LEVEL || 'info'}`);
        logger.info(`   - Max Instâncias: ${maxInstances}`);

    } catch (error) {
        logger.error('💥 Erro na validação de ambiente:');
        logger.error(error.message);
        logger.error('\n📖 Consulte o arquivo .env.example para configuração correta');
        process.exit(1);
    }
}

module.exports = {
    validateRequired,
    validateOptional,
    validatePort,
    validateLogLevel,
    validateEnvironment
};
