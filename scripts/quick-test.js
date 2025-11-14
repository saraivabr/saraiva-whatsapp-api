#!/usr/bin/env node

/**
 * Script de Teste Rápido
 * Testa se a API está funcionando corretamente
 */

const http = require('http');

const PORT = process.env.PORT || 3333;
const HOST = process.env.HOST || 'localhost';

console.log('\n🧪 Teste Rápido - Saraiva WhatsApp API\n');
console.log('═'.repeat(60));

// Testes a executar
const tests = [
    {
        name: 'Health Check Básico',
        path: '/health',
        expected: 200
    },
    {
        name: 'Health Check Detalhado',
        path: '/health/detailed',
        expected: 200
    },
    {
        name: 'Status da API',
        path: '/status',
        expected: 200
    },
    {
        name: 'Readiness Probe',
        path: '/health/ready',
        expected: 200
    },
    {
        name: 'Liveness Probe',
        path: '/health/live',
        expected: 200
    }
];

let passed = 0;
let failed = 0;

// Função para fazer requisição
function makeRequest(test) {
    return new Promise((resolve) => {
        const options = {
            hostname: HOST,
            port: PORT,
            path: test.path,
            method: 'GET',
            timeout: 5000
        };

        const req = http.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                const success = res.statusCode === test.expected;

                if (success) {
                    console.log(`✅ ${test.name}`);
                    console.log(`   Status: ${res.statusCode}`);
                    passed++;
                } else {
                    console.log(`❌ ${test.name}`);
                    console.log(`   Esperado: ${test.expected}, Recebido: ${res.statusCode}`);
                    failed++;
                }

                // Mostra dados se for JSON
                try {
                    const json = JSON.parse(data);
                    if (process.argv.includes('--verbose') || process.argv.includes('-v')) {
                        console.log(`   Resposta:`, json);
                    }
                } catch (e) {
                    // Não é JSON
                }

                console.log('');
                resolve();
            });
        });

        req.on('error', (error) => {
            console.log(`❌ ${test.name}`);
            console.log(`   Erro: ${error.message}`);
            console.log('');
            failed++;
            resolve();
        });

        req.on('timeout', () => {
            console.log(`❌ ${test.name}`);
            console.log(`   Erro: Timeout (5s)`);
            console.log('');
            failed++;
            req.destroy();
            resolve();
        });

        req.end();
    });
}

// Executa testes sequencialmente
async function runTests() {
    console.log(`📍 Testando servidor em http://${HOST}:${PORT}\n`);

    for (const test of tests) {
        await makeRequest(test);
    }

    // Resultado final
    console.log('═'.repeat(60));
    console.log('\n📊 Resultado dos Testes:\n');
    console.log(`   ✅ Passou: ${passed}`);
    console.log(`   ❌ Falhou: ${failed}`);
    console.log(`   📝 Total:  ${tests.length}\n`);

    if (failed === 0) {
        console.log('🎉 Todos os testes passaram! API está funcionando corretamente.\n');
        process.exit(0);
    } else {
        console.log('⚠️  Alguns testes falharam. Verifique se o servidor está rodando.\n');
        console.log('💡 Dica: Execute "npm start" ou "docker-compose up" primeiro.\n');
        process.exit(1);
    }
}

// Inicia testes
runTests().catch(error => {
    console.error('❌ Erro ao executar testes:', error);
    process.exit(1);
});
