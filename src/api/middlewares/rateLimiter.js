/**
 * Middleware de Rate Limiting
 * Protege a API contra abuso e ataques de força bruta
 */

const rateLimit = require('express-rate-limit');
const logger = require('pino')();

/**
 * Rate limiter geral para todas as rotas
 * 100 requisições por 15 minutos
 */
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Máximo de 100 requisições por janela
    standardHeaders: true, // Retorna info de rate limit nos headers `RateLimit-*`
    legacyHeaders: false, // Desabilita headers `X-RateLimit-*`
    message: {
        success: false,
        error: 'Muitas requisições. Por favor, tente novamente mais tarde.',
        retryAfter: '15 minutos'
    },
    handler: (req, res) => {
        logger.warn(`⚠️ Rate limit excedido para IP: ${req.ip} - Path: ${req.path}`);
        res.status(429).json({
            success: false,
            error: 'Muitas requisições. Por favor, tente novamente mais tarde.',
            retryAfter: '15 minutos'
        });
    },
    skip: (req) => {
        // Permite requisições de healthcheck
        return req.path === '/health' || req.path === '/status';
    }
});

/**
 * Rate limiter rigoroso para rotas de autenticação
 * 5 tentativas por 15 minutos
 */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Máximo de 5 tentativas
    skipSuccessfulRequests: true, // Não conta requisições bem-sucedidas
    message: {
        success: false,
        error: 'Muitas tentativas de autenticação. Por favor, aguarde 15 minutos.',
    },
    handler: (req, res) => {
        logger.warn(`🚨 Rate limit de autenticação excedido para IP: ${req.ip}`);
        res.status(429).json({
            success: false,
            error: 'Muitas tentativas de autenticação. Por favor, aguarde 15 minutos.',
        });
    }
});

/**
 * Rate limiter para criação de instâncias
 * 10 instâncias por hora
 */
const instanceCreationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 10, // Máximo de 10 instâncias por hora
    message: {
        success: false,
        error: 'Limite de criação de instâncias excedido. Tente novamente em 1 hora.',
    },
    handler: (req, res) => {
        logger.warn(`⚠️ Limite de criação de instâncias excedido para IP: ${req.ip}`);
        res.status(429).json({
            success: false,
            error: 'Limite de criação de instâncias excedido. Tente novamente em 1 hora.',
        });
    }
});

/**
 * Rate limiter para envio de mensagens
 * 60 mensagens por minuto
 */
const messageLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 60, // Máximo de 60 mensagens por minuto
    message: {
        success: false,
        error: 'Limite de envio de mensagens excedido. Aguarde 1 minuto.',
    },
    handler: (req, res) => {
        logger.warn(`⚠️ Limite de mensagens excedido para IP: ${req.ip}`);
        res.status(429).json({
            success: false,
            error: 'Limite de envio de mensagens excedido. Aguarde 1 minuto.',
        });
    }
});

module.exports = {
    generalLimiter,
    authLimiter,
    instanceCreationLimiter,
    messageLimiter
};
