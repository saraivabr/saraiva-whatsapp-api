/**
 * Middleware de Segurança
 * Configura headers de segurança e CORS
 */

const helmet = require('helmet');
const cors = require('cors');
const logger = require('pino')();

/**
 * Configuração de CORS
 * Permite requisições de diferentes origens de forma controlada
 */
const corsOptions = {
    origin: function (origin, callback) {
        // Permite requisições sem origin (mobile apps, curl, etc)
        if (!origin) {
            return callback(null, true);
        }

        // Em desenvolvimento, permite todas as origens
        if (process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }

        // Em produção, valida a origem
        const allowedOrigins = process.env.ALLOWED_ORIGINS
            ? process.env.ALLOWED_ORIGINS.split(',')
            : [];

        if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            logger.warn(`🚫 Origem bloqueada por CORS: ${origin}`);
            callback(new Error('Origem não permitida pelo CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

/**
 * Configuração do Helmet
 * Define headers de segurança HTTP
 */
const helmetConfig = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'https:'],
        },
    },
    hsts: {
        maxAge: 31536000, // 1 ano
        includeSubDomains: true,
        preload: true
    },
    frameguard: {
        action: 'deny'
    },
    noSniff: true,
    xssFilter: true,
});

/**
 * Middleware para sanitização de entrada
 * Remove caracteres perigosos das requisições
 */
function sanitizeInput(req, res, next) {
    // Sanitiza query params
    if (req.query) {
        Object.keys(req.query).forEach(key => {
            if (typeof req.query[key] === 'string') {
                req.query[key] = req.query[key].trim();
            }
        });
    }

    // Sanitiza body
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].trim();
            }
        });
    }

    next();
}

/**
 * Middleware para adicionar headers de segurança customizados
 */
function securityHeaders(req, res, next) {
    // Remove header que expõe tecnologia
    res.removeHeader('X-Powered-By');

    // Adiciona header de API version
    res.setHeader('X-API-Version', '1.0.0');

    // Previne clickjacking
    res.setHeader('X-Frame-Options', 'DENY');

    // Força HTTPS em produção
    if (process.env.NODE_ENV === 'production') {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }

    next();
}

/**
 * Middleware para log de requisições suspeitas
 */
function logSuspiciousActivity(req, res, next) {
    const suspiciousPatterns = [
        /(\.\.|~|\/etc\/|\/var\/)/i, // Path traversal
        /(union.*select|insert.*into|drop.*table)/i, // SQL Injection
        /(<script|javascript:|onerror=|onclick=)/i, // XSS
        /(cmd|exec|eval|system)/i // Command injection
    ];

    const checkString = JSON.stringify({
        ...req.query,
        ...req.body,
        ...req.params
    });

    for (const pattern of suspiciousPatterns) {
        if (pattern.test(checkString)) {
            logger.warn({
                type: 'SUSPICIOUS_REQUEST',
                ip: req.ip,
                path: req.path,
                method: req.method,
                pattern: pattern.toString(),
                data: checkString
            }, '🚨 Atividade suspeita detectada');
            break;
        }
    }

    next();
}

module.exports = {
    corsMiddleware: cors(corsOptions),
    helmetMiddleware: helmetConfig,
    sanitizeInput,
    securityHeaders,
    logSuspiciousActivity
};
