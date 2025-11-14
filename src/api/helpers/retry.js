/**
 * Sistema de Retry para Operações Críticas
 * Implementa tentativas automáticas com backoff exponencial
 */

const { logger } = require('../../config/logger');

/**
 * Executa uma função com retry automático
 *
 * @param {Function} fn - Função async a ser executada
 * @param {Object} options - Opções de retry
 * @param {number} options.maxRetries - Número máximo de tentativas (padrão: 3)
 * @param {number} options.delay - Delay inicial em ms (padrão: 1000)
 * @param {number} options.backoff - Multiplicador do backoff (padrão: 2)
 * @param {Function} options.onRetry - Callback executado em cada retry
 * @param {Array} options.retryableErrors - Lista de erros que devem fazer retry
 * @returns {Promise} Resultado da função ou erro após todas tentativas
 */
async function retryOperation(fn, options = {}) {
    const {
        maxRetries = 3,
        delay = 1000,
        backoff = 2,
        onRetry = null,
        retryableErrors = [],
        operationName = 'Operação'
    } = options;

    let lastError;
    let currentDelay = delay;

    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
        try {
            const result = await fn();

            if (attempt > 1) {
                logger.info(`✅ ${operationName} bem-sucedida na tentativa ${attempt}`);
            }

            return result;

        } catch (error) {
            lastError = error;

            // Verifica se é um erro que deve fazer retry
            const shouldRetry = retryableErrors.length === 0 ||
                retryableErrors.some(errorType =>
                    error.name === errorType ||
                    error.message.includes(errorType)
                );

            if (!shouldRetry || attempt > maxRetries) {
                logger.error({
                    operation: operationName,
                    attempt,
                    error: error.message
                }, `❌ ${operationName} falhou definitivamente após ${attempt} tentativa(s)`);
                throw error;
            }

            logger.warn({
                operation: operationName,
                attempt,
                maxRetries,
                nextRetryIn: currentDelay,
                error: error.message
            }, `⚠️ ${operationName} falhou, tentando novamente em ${currentDelay}ms...`);

            // Callback opcional
            if (onRetry) {
                await onRetry(error, attempt);
            }

            // Aguarda antes da próxima tentativa
            await sleep(currentDelay);

            // Backoff exponencial
            currentDelay *= backoff;
        }
    }

    throw lastError;
}

/**
 * Wrapper para requisições HTTP com retry
 */
async function retryHttpRequest(requestFn, options = {}) {
    return retryOperation(requestFn, {
        maxRetries: options.maxRetries || 3,
        delay: options.delay || 1000,
        backoff: options.backoff || 2,
        operationName: options.operationName || 'Requisição HTTP',
        retryableErrors: [
            'ECONNRESET',
            'ETIMEDOUT',
            'ECONNREFUSED',
            'EHOSTUNREACH',
            'EAI_AGAIN',
            'socket hang up',
            'Request failed',
            'Network error',
            '502',
            '503',
            '504'
        ],
        ...options
    });
}

/**
 * Wrapper para operações de banco de dados com retry
 */
async function retryDatabaseOperation(operationFn, options = {}) {
    return retryOperation(operationFn, {
        maxRetries: options.maxRetries || 5,
        delay: options.delay || 500,
        backoff: options.backoff || 1.5,
        operationName: options.operationName || 'Operação de banco',
        retryableErrors: [
            'ECONNREFUSED',
            'Connection lost',
            'Connection timeout',
            'Lock wait timeout',
            'Deadlock',
        ],
        ...options
    });
}

/**
 * Wrapper para operações do WhatsApp com retry
 */
async function retryWhatsAppOperation(operationFn, options = {}) {
    return retryOperation(operationFn, {
        maxRetries: options.maxRetries || 3,
        delay: options.delay || 2000,
        backoff: options.backoff || 2,
        operationName: options.operationName || 'Operação WhatsApp',
        retryableErrors: [
            'rate-overlimit',
            'Connection Closed',
            'Timed Out',
            'SERVICE_UNAVAILABLE',
            'INTERNAL_SERVER_ERROR'
        ],
        ...options
    });
}

/**
 * Circuit Breaker simples
 * Previne tentativas repetidas quando serviço está definitivamente fora
 */
class CircuitBreaker {
    constructor(options = {}) {
        this.failureThreshold = options.failureThreshold || 5;
        this.resetTimeout = options.resetTimeout || 60000; // 1 minuto
        this.failureCount = 0;
        this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
        this.nextAttempt = Date.now();
    }

    async execute(fn) {
        if (this.state === 'OPEN') {
            if (Date.now() < this.nextAttempt) {
                throw new Error('Circuit breaker está ABERTO. Serviço temporariamente indisponível.');
            }
            this.state = 'HALF_OPEN';
        }

        try {
            const result = await fn();
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            throw error;
        }
    }

    onSuccess() {
        this.failureCount = 0;
        this.state = 'CLOSED';
    }

    onFailure() {
        this.failureCount++;
        if (this.failureCount >= this.failureThreshold) {
            this.state = 'OPEN';
            this.nextAttempt = Date.now() + this.resetTimeout;
            logger.warn(`🔴 Circuit breaker ABERTO. Próxima tentativa em ${this.resetTimeout}ms`);
        }
    }

    getState() {
        return this.state;
    }
}

/**
 * Helper para sleep
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    retryOperation,
    retryHttpRequest,
    retryDatabaseOperation,
    retryWhatsAppOperation,
    CircuitBreaker,
    sleep
};
