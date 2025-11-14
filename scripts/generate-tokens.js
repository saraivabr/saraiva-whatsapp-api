#!/usr/bin/env node

/**
 * Gerador de Tokens Seguros
 * Gera tokens aleatórios para uso na API
 */

const crypto = require('crypto');

console.log('\n🔐 Gerador de Tokens Seguros - Saraiva WhatsApp API\n');
console.log('═'.repeat(60));

// Gera tokens
const generateToken = (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
};

const tokens = {
    TOKEN: generateToken(32),
    ADMINTOKEN: generateToken(32),
    SESSION_SECRET: generateToken(48),
    COOKIE_SECRET: generateToken(48),
};

console.log('\n📋 Tokens gerados (copie para seu .env):\n');

for (const [key, value] of Object.entries(tokens)) {
    console.log(`${key}=${value}`);
}

console.log('\n═'.repeat(60));
console.log('\n💡 Dicas de uso:');
console.log('   - Nunca compartilhe estes tokens');
console.log('   - Use tokens diferentes em cada ambiente');
console.log('   - Salve estes tokens em um local seguro');
console.log('   - Para produção, considere usar um gerenciador de secrets\n');

// Salva em arquivo se solicitado
const args = process.argv.slice(2);
if (args.includes('--save') || args.includes('-s')) {
    const fs = require('fs');
    const output = Object.entries(tokens)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');

    const filename = `.env.tokens-${Date.now()}`;
    fs.writeFileSync(filename, output + '\n');
    console.log(`✅ Tokens salvos em: ${filename}\n`);
}
