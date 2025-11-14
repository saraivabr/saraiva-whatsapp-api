/**
 * Sistema de Logs Estruturado com Pino
 * Logging profissional com níveis, timestamps e formatação
 */

const pino = require('pino');
const path = require('path');
const fs = require('fs');

// Cria diretório de logs se não existir
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Configuração do Pino baseada no ambiente
 */
const isDevelopment = process.env.NODE_ENV !== 'production';
const logLevel = process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info');

/**
 * Opções do logger
 */
const loggerOptions = {
    level: logLevel,
    formatters: {
        level: (label) => {
            return { level: label.toUpperCase() };
        },
        bindings: (bindings) => {
            return {
                pid: bindings.pid,
                hostname: bindings.hostname,
                node_version: process.version,
            };
        },
    },
    timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
    // Serializers customizados para objetos específicos
    serializers: {
        req: (req) => ({
            method: req.method,
            url: req.url,
            path: req.path,
            params: req.params,
            query: req.query,
            headers: {
                host: req.headers.host,
                'user-agent': req.headers['user-agent'],
                'content-type': req.headers['content-type'],
            },
            ip: req.ip,
        }),
        res: (res) => ({
            statusCode: res.statusCode,
            headers: res.getHeaders ? res.getHeaders() : {},
        }),
        err: pino.stdSerializers.err,
    },
};

/**
 * Configura transports (destinos) dos logs
 */
const transports = [];

// Em desenvolvimento: Pretty print no console
if (isDevelopment) {
    transports.push({
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:dd/mm/yyyy HH:MM:ss',
            ignore: 'pid,hostname',
            singleLine: false,
            messageFormat: '{msg}',
        },
    });
} else {
    // Em produção: JSON no console
    transports.push({
        target: 'pino/file',
        options: { destination: 1 }, // stdout
    });
}

// Sempre salva logs em arquivo
transports.push({
    target: 'pino/file',
    options: {
        destination: path.join(logsDir, `app-${new Date().toISOString().split('T')[0]}.log`),
        mkdir: true,
    },
});

// Logs de erro em arquivo separado
transports.push({
    target: 'pino/file',
    level: 'error',
    options: {
        destination: path.join(logsDir, `error-${new Date().toISOString().split('T')[0]}.log`),
        mkdir: true,
    },
});

/**
 * Cria o logger principal
 */
const logger = pino(
    loggerOptions,
    pino.transport({
        targets: transports,
    })
);

/**
 * Middleware do Express para logging de requisições
 */
function requestLogger(req, res, next) {
    const start = Date.now();

    // Log da requisição
    logger.info({
        type: 'REQUEST',
        req,
    }, `➡️  ${req.method} ${req.path}`);

    // Intercepta o final da resposta
    const originalSend = res.send;
    res.send = function (data) {
        const duration = Date.now() - start;

        logger.info({
            type: 'RESPONSE',
            res,
            duration: `${duration}ms`,
            size: typeof data === 'string' ? data.length : 0,
        }, `⬅️  ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);

        originalSend.call(this, data);
    };

    next();
}

/**
 * Cria loggers filho para módulos específicos
 */
function createModuleLogger(module) {
    return logger.child({ module });
}

/**
 * Rotação de logs antiga (limpeza)
 */
function cleanOldLogs(daysToKeep = 7) {
    const now = Date.now();
    const maxAge = daysToKeep * 24 * 60 * 60 * 1000;

    fs.readdir(logsDir, (err, files) => {
        if (err) {
            logger.error('Erro ao limpar logs antigos:', err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(logsDir, file);
            fs.stat(filePath, (err, stats) => {
                if (err) return;

                if (now - stats.mtimeMs > maxAge) {
                    fs.unlink(filePath, (err) => {
                        if (!err) {
                            logger.info(`🗑️  Log antigo removido: ${file}`);
                        }
                    });
                }
            });
        });
    });
}

// Limpa logs antigos na inicialização
if (!isDevelopment) {
    cleanOldLogs();
}

module.exports = {
    logger,
    requestLogger,
    createModuleLogger,
    cleanOldLogs,
};
