/**
 * Validadores de Entrada
 * Funções auxiliares para validação de dados
 */

const { logger } = require('../../config/logger');

/**
 * Valida número de telefone no formato internacional
 */
function validatePhoneNumber(phone) {
    if (!phone) {
        return { valid: false, error: 'Número de telefone é obrigatório' };
    }

    // Remove caracteres não numéricos
    const cleanPhone = phone.toString().replace(/\D/g, '');

    // Verifica se tem comprimento adequado (10-15 dígitos)
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
        return {
            valid: false,
            error: 'Número de telefone deve ter entre 10 e 15 dígitos'
        };
    }

    // Formato WhatsApp: número@s.whatsapp.net
    const whatsappNumber = cleanPhone.includes('@')
        ? cleanPhone
        : `${cleanPhone}@s.whatsapp.net`;

    return {
        valid: true,
        phone: whatsappNumber,
        cleanPhone
    };
}

/**
 * Valida ID de grupo
 */
function validateGroupId(groupId) {
    if (!groupId) {
        return { valid: false, error: 'ID do grupo é obrigatório' };
    }

    // Formato: número@g.us
    if (!groupId.includes('@g.us') && !groupId.includes('@')) {
        groupId = `${groupId}@g.us`;
    }

    return {
        valid: true,
        groupId
    };
}

/**
 * Valida chave de instância
 */
function validateInstanceKey(key) {
    if (!key || typeof key !== 'string') {
        return { valid: false, error: 'Chave da instância é obrigatória' };
    }

    if (key.length < 3 || key.length > 50) {
        return {
            valid: false,
            error: 'Chave da instância deve ter entre 3 e 50 caracteres'
        };
    }

    // Permite apenas letras, números, hífens e underscores
    if (!/^[a-zA-Z0-9_-]+$/.test(key)) {
        return {
            valid: false,
            error: 'Chave da instância deve conter apenas letras, números, hífens e underscores'
        };
    }

    return { valid: true, key };
}

/**
 * Valida URL
 */
function validateUrl(url) {
    if (!url) {
        return { valid: false, error: 'URL é obrigatória' };
    }

    try {
        const urlObj = new URL(url);
        if (!['http:', 'https:'].includes(urlObj.protocol)) {
            return { valid: false, error: 'URL deve usar protocolo HTTP ou HTTPS' };
        }
        return { valid: true, url };
    } catch (error) {
        return { valid: false, error: 'URL inválida' };
    }
}

/**
 * Valida arquivo de mídia
 */
function validateMediaFile(file, allowedTypes = []) {
    if (!file) {
        return { valid: false, error: 'Arquivo é obrigatório' };
    }

    // Valida tipo de arquivo
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.mimetype)) {
        return {
            valid: false,
            error: `Tipo de arquivo não permitido. Permitidos: ${allowedTypes.join(', ')}`
        };
    }

    // Valida tamanho (máximo 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
        return {
            valid: false,
            error: 'Arquivo muito grande. Máximo: 50MB'
        };
    }

    return { valid: true, file };
}

/**
 * Valida texto de mensagem
 */
function validateMessageText(text) {
    if (!text || typeof text !== 'string') {
        return { valid: false, error: 'Texto da mensagem é obrigatório' };
    }

    if (text.trim().length === 0) {
        return { valid: false, error: 'Texto da mensagem não pode estar vazio' };
    }

    // WhatsApp tem limite de ~65KB por mensagem
    if (text.length > 65000) {
        return {
            valid: false,
            error: 'Mensagem muito longa. Máximo: 65.000 caracteres'
        };
    }

    return { valid: true, text: text.trim() };
}

/**
 * Valida coordenadas geográficas
 */
function validateCoordinates(latitude, longitude) {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
        return {
            valid: false,
            error: 'Coordenadas inválidas. Devem ser números'
        };
    }

    if (lat < -90 || lat > 90) {
        return {
            valid: false,
            error: 'Latitude deve estar entre -90 e 90'
        };
    }

    if (lng < -180 || lng > 180) {
        return {
            valid: false,
            error: 'Longitude deve estar entre -180 e 180'
        };
    }

    return {
        valid: true,
        latitude: lat,
        longitude: lng
    };
}

/**
 * Sanitiza texto removendo caracteres perigosos
 */
function sanitizeText(text) {
    if (!text || typeof text !== 'string') {
        return '';
    }

    // Remove null bytes e controle characters (exceto \n, \r, \t)
    return text
        .replace(/\x00/g, '')
        .replace(/[\x01-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')
        .trim();
}

/**
 * Middleware do Express para validação de requisição
 */
function validateRequest(schema) {
    return (req, res, next) => {
        const errors = [];

        for (const [field, validator] of Object.entries(schema)) {
            const value = req.body[field] || req.query[field] || req.params[field];
            const result = validator(value);

            if (!result.valid) {
                errors.push({
                    field,
                    error: result.error
                });
            } else {
                // Atualiza o valor validado
                if (req.body[field] !== undefined) req.body[field] = result[field] || value;
                if (req.query[field] !== undefined) req.query[field] = result[field] || value;
                if (req.params[field] !== undefined) req.params[field] = result[field] || value;
            }
        }

        if (errors.length > 0) {
            logger.warn({ errors, path: req.path }, '⚠️ Validação de entrada falhou');
            return res.status(400).json({
                success: false,
                error: 'Erro de validação',
                details: errors
            });
        }

        next();
    };
}

module.exports = {
    validatePhoneNumber,
    validateGroupId,
    validateInstanceKey,
    validateUrl,
    validateMediaFile,
    validateMessageText,
    validateCoordinates,
    sanitizeText,
    validateRequest
};
