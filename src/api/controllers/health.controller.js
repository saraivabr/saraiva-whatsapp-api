/**
 * Controlador de Healthcheck
 * Fornece informações sobre a saúde da aplicação
 */

const os = require('os');
const logger = require('pino')();

/**
 * Healthcheck básico - para load balancers
 */
exports.basic = async (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
};

/**
 * Healthcheck detalhado - para monitoramento
 */
exports.detailed = async (req, res) => {
    try {
        const uptime = process.uptime();
        const memoryUsage = process.memoryUsage();
        const cpuUsage = process.cpuUsage();

        // Calcula uso de memória em MB
        const memoryInMB = {
            rss: Math.round(memoryUsage.rss / 1024 / 1024 * 100) / 100,
            heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024 * 100) / 100,
            heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024 * 100) / 100,
            external: Math.round(memoryUsage.external / 1024 / 1024 * 100) / 100
        };

        // Conta instâncias ativas
        const activeInstances = Object.keys(global.WhatsAppInstances || {}).length;

        // Status geral
        const status = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: {
                seconds: Math.floor(uptime),
                formatted: formatUptime(uptime)
            },
            system: {
                platform: os.platform(),
                arch: os.arch(),
                nodeVersion: process.version,
                cpus: os.cpus().length,
                totalMemory: Math.round(os.totalmem() / 1024 / 1024),
                freeMemory: Math.round(os.freemem() / 1024 / 1024),
                loadAverage: os.loadavg()
            },
            process: {
                pid: process.pid,
                memory: memoryInMB,
                cpu: {
                    user: cpuUsage.user,
                    system: cpuUsage.system
                }
            },
            application: {
                environment: process.env.NODE_ENV || 'development',
                port: process.env.PORT || 3333,
                activeInstances: activeInstances,
                maxInstances: process.env.MAX_INSTANCES || 50
            }
        };

        // Verifica se está saudável
        const healthChecks = {
            memory: memoryInMB.heapUsed < 500, // Menos de 500MB
            instances: activeInstances <= Number(process.env.MAX_INSTANCES || 50)
        };

        const isHealthy = Object.values(healthChecks).every(check => check);

        if (!isHealthy) {
            status.status = 'degraded';
            status.checks = healthChecks;
            logger.warn('⚠️ Sistema em estado degradado', status);
        }

        res.status(isHealthy ? 200 : 503).json(status);

    } catch (error) {
        logger.error('❌ Erro ao verificar health:', error);
        res.status(500).json({
            status: 'error',
            timestamp: new Date().toISOString(),
            error: error.message
        });
    }
};

/**
 * Healthcheck de readiness - verifica se está pronto para receber tráfego
 */
exports.readiness = async (req, res) => {
    try {
        // Verifica se as dependências críticas estão ok
        const checks = {
            server: true,
            memory: process.memoryUsage().heapUsed < 512 * 1024 * 1024, // < 512MB
            instances: Object.keys(global.WhatsAppInstances || {}).length < Number(process.env.MAX_INSTANCES || 50)
        };

        const isReady = Object.values(checks).every(check => check);

        res.status(isReady ? 200 : 503).json({
            ready: isReady,
            checks,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        logger.error('❌ Erro ao verificar readiness:', error);
        res.status(503).json({
            ready: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
};

/**
 * Healthcheck de liveness - verifica se está vivo
 */
exports.liveness = async (req, res) => {
    // Simples - se responder, está vivo
    res.status(200).json({
        alive: true,
        timestamp: new Date().toISOString()
    });
};

/**
 * Formata tempo de uptime
 */
function formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

    return parts.join(' ');
}
